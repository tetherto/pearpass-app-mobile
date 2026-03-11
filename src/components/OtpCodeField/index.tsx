import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { LockIcon } from 'pearpass-lib-ui-react-native-components'
import {
  formatOtpCode,
  OTP_TYPE,
  useOtp,
  useTimerAnimation
} from 'pearpass-lib-vault'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { useTheme } from 'styled-components/native'

import {
  NextCodeButton,
  NextCodeButtonText,
  TimerBarContainer,
  TimerBarTrack,
  TimerText
} from './styles'
import { getTimerColor, TIMER_ANIMATION_DURATION } from './utils'
import { InputField } from '../../libComponents'

interface OtpPublic {
  type: 'TOTP' | 'HOTP'
  digits: number
  period?: number
  issuer?: string
  label?: string
  currentCode: string | null
  timeRemaining?: number | null
}

interface OtpCodeFieldProps {
  recordId: string
  otpPublic: OtpPublic
  isFirst?: boolean
  isLast?: boolean
}

export const OtpCodeField = ({
  recordId,
  otpPublic,
  isFirst,
  isLast
}: OtpCodeFieldProps) => {
  const { t } = useLingui()
  const theme = useTheme()
  const { code, timeRemaining, type, period, generateNext, isLoading } =
    useOtp({
      recordId,
      otpPublic
    })

  const formattedCode = formatOtpCode(code)
  const isTOTP = type === OTP_TYPE.TOTP

  const { noTransition, expiring, targetTime } = useTimerAnimation(
    timeRemaining,
    period ?? 30
  )

  const progress =
    timeRemaining !== null && period ? (targetTime / period) * 100 : 0

  const widthProgress = useSharedValue(progress)

  useEffect(() => {
    if (noTransition) {
      widthProgress.value = progress
    } else {
      widthProgress.value = withTiming(progress, {
        duration: TIMER_ANIMATION_DURATION,
        easing: Easing.linear
      })
    }
  }, [progress, noTransition])

  const fillColor = getTimerColor(theme, expiring)

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthProgress.value}%`,
    height: '100%',
    borderRadius: 10,
    backgroundColor: fillColor
  }))

  const timerBar = isTOTP ? (
    <TimerBarContainer>
      <TimerBarTrack>
        <Animated.View style={fillStyle} />
      </TimerBarTrack>
      <TimerText $expiring={expiring}>
        {timeRemaining !== null ? `${timeRemaining}s` : ''}
      </TimerText>
    </TimerBarContainer>
  ) : null

  return (
    <InputField
      icon={LockIcon}
      label={t`Authenticator Token`}
      value={formattedCode}
      variant="outline"
      isDisabled
      isFirst={isFirst}
      isLast={isLast}
      belowInputContent={timerBar}
      additionalItems={
        type === OTP_TYPE.HOTP && generateNext ? (
          <NextCodeButton
            onPress={generateNext}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <NextCodeButtonText>{t`Next Code`}</NextCodeButtonText>
          </NextCodeButton>
        ) : undefined
      }
    />
  )
}
