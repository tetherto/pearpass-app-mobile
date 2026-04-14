import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { LockIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  formatOtpCode,
  OTP_TYPE,
  useOtp,
  useTimerAnimation
} from '@tetherto/pearpass-lib-vault'
import { Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import type { OtpPublic } from '@tetherto/pearpass-lib-vault/src/types'

import { styles } from './styles'
import { getTimerColor, TIMER_ANIMATION_DURATION } from './utils'
import { InputField } from '../../libComponents'

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
  const { code, timeRemaining, type, period, generateNext, isLoading } = useOtp(
    {
      recordId,
      otpPublic
    }
  )

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

  const fillColor = getTimerColor(expiring)

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthProgress.value}%`,
    height: '100%',
    borderRadius: 10,
    backgroundColor: fillColor
  }))

  const timerBar = isTOTP ? (
    <View style={styles.timerBarContainer}>
      <View style={styles.timerBarTrack}>
        <Animated.View style={fillStyle} />
      </View>
      <Text style={[styles.timerText, { color: getTimerColor(expiring) }]}>
        {timeRemaining !== null ? `${timeRemaining}s` : ''}
      </Text>
    </View>
  ) : null

  return (
    // @ts-ignore - InputField is a JS component with partial JSDoc types
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
          <TouchableOpacity
            style={[
              styles.nextCodeButton,
              isLoading && styles.nextCodeButtonDisabled
            ]}
            onPress={generateNext}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.nextCodeButtonText}>{t`Next Code`}</Text>
          </TouchableOpacity>
        ) : undefined
      }
    />
  )
}
