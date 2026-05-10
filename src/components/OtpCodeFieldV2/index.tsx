import { useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  Button,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { ContentCopy } from '@tetherto/pearpass-lib-ui-kit/icons'
import {
  formatOtpCode,
  OTP_TYPE,
  useOtp,
  useTimerAnimation
} from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import type { OtpPublic } from '@tetherto/pearpass-lib-vault/src/types'

import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'

const TIMER_ANIMATION_DURATION = 1000
const EXPIRY_THRESHOLD_SECONDS = 5

interface OtpCodeFieldV2Props {
  recordId: string
  otpPublic: OtpPublic
  isGrouped?: boolean
}

export const OtpCodeFieldV2 = ({
  recordId,
  otpPublic,
  isGrouped = false
}: OtpCodeFieldV2Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { copyToClipboard } = useCopyToClipboard()

  const { code, timeRemaining, type, period, generateNext, isLoading } = useOtp(
    {
      recordId,
      otpPublic
    }
  )

  const formattedCode = formatOtpCode(code)
  const isTOTP = type === OTP_TYPE.TOTP
  const isHOTP = type === OTP_TYPE.HOTP

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
  }, [progress, noTransition, widthProgress])

  const timerColor = expiring
    ? theme.colors.colorTextDestructive
    : theme.colors.colorPrimary

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthProgress.value}%`,
    height: '100%',
    borderRadius: rawTokens.radius8,
    backgroundColor: timerColor
  }))

  const cardStyle = isGrouped
    ? [styles.cardGrouped, { borderBottomColor: theme.colors.colorBorderPrimary }]
    : [
        styles.card,
        {
          borderColor: theme.colors.colorBorderPrimary,
          backgroundColor: theme.colors.colorSurfacePrimary
        }
      ]

  return (
    <View style={cardStyle}>
      <View style={styles.topRow}>
        <View style={styles.innerColumn}>
          <Text variant="caption" color={theme.colors.colorTextPrimary}>
            {t`Authenticator Token`}
          </Text>
          <Text variant="labelEmphasized" numberOfLines={1}>
            {formattedCode || ''}
          </Text>
        </View>
        <Button
          variant="tertiary"
          size="small"
          aria-label={t`Copy code`}
          iconBefore={<ContentCopy color={theme.colors.colorTextPrimary} />}
          onClick={() => code && copyToClipboard(code)}
        />
      </View>

      {isTOTP && (
        <View style={styles.timerRow}>
          <View
            style={[
              styles.timerTrack,
              { backgroundColor: theme.colors.colorBorderPrimary }
            ]}
          >
            <Animated.View style={fillStyle} />
          </View>
          <Text
            variant="caption"
            style={
              {
                color: timerColor,
                minWidth: 28,
                textAlign: 'right'
              } as object
            }
          >
            {timeRemaining !== null ? `${timeRemaining}s` : ''}
          </Text>
        </View>
      )}

      {isHOTP && generateNext && (
        <Button
          variant="secondary"
          size="small"
          fullWidth
          disabled={isLoading}
          onClick={generateNext}
        >
          {t`Next Code`}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: rawTokens.radius8,
    borderWidth: 1,
    padding: rawTokens.spacing12,
    gap: rawTokens.spacing12
  },
  cardGrouped: {
    padding: rawTokens.spacing12,
    gap: rawTokens.spacing12,
    borderBottomWidth: 1,
    backgroundColor: 'transparent'
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8
  },
  innerColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 2
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8
  },
  timerTrack: {
    flex: 1,
    height: 6,
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  }
})

export { EXPIRY_THRESHOLD_SECONDS }
