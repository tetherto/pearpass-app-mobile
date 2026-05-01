import { useCallback, useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useTheme, rawTokens, Text } from '@tetherto/pearpass-lib-ui-kit'
import { ContentCopy } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { SvgXml } from 'react-native-svg'

import { useShareVault } from './useShareVault'
import { Layout } from '../../containers/Layout'
import { BackScreenHeader } from '../../containers/ScreenHeader/BackScreenHeader'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const EXPIRE_PERIOD = 120
const TIMER_SIZE = 14
const TIMER_RADIUS = 5.5
const TIMER_STROKE_WIDTH = 1.5
const TIMER_CENTER = TIMER_SIZE / 2
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS

export const ShareVault = () => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const navigation = useNavigation()

  const { data: vault } = useVault()
  const { svg, isExpired, formattedTime, secondsLeft, vaultLink, handleCopy } =
    useShareVault()

  const vaultName = vault?.name ?? t`Vault`

  const handleBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  useEffect(() => {
    if (isExpired) {
      navigation.goBack()
    }
  }, [isExpired, navigation])

  const targetOffset = (1 - secondsLeft / EXPIRE_PERIOD) * TIMER_CIRCUMFERENCE
  const animatedOffset = useSharedValue(targetOffset)

  useEffect(() => {
    animatedOffset.value = withTiming(targetOffset, {
      duration: 1000,
      easing: Easing.linear
    })
  }, [targetOffset])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value
  }))

  return (
    <Layout
      header={
        <BackScreenHeader title={t`Share ${vaultName}`} onBack={handleBack} />
      }
      scrollable
      hideFooter
    >
      <View style={styles.content}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Access Code`}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.colorSurfacePrimary,
              borderColor: theme.colors.colorBorderPrimary
            }
          ]}
        >
          <View style={styles.qrSection}>
            <View
              style={[
                styles.qrContainer,
                { backgroundColor: theme.colors.colorSurfaceHover }
              ]}
            >
              {svg.length > 0 && (
                <SvgXml
                  testID="share-vault-qr-code"
                  xml={svg}
                  width="100%"
                  height="100%"
                />
              )}
            </View>

            <View style={styles.timerRow}>
              <View style={styles.timerCircle}>
                <Svg
                  width={TIMER_SIZE}
                  height={TIMER_SIZE}
                  viewBox={`0 0 ${TIMER_SIZE} ${TIMER_SIZE}`}
                  style={styles.timerSvg}
                >
                  <Circle
                    cx={TIMER_CENTER}
                    cy={TIMER_CENTER}
                    r={TIMER_RADIUS}
                    fill="none"
                    stroke={theme.colors.colorSurfaceElevatedOnInteraction}
                    strokeWidth={TIMER_STROKE_WIDTH}
                  />
                  <AnimatedCircle
                    cx={TIMER_CENTER}
                    cy={TIMER_CENTER}
                    r={TIMER_RADIUS}
                    fill="none"
                    stroke={theme.colors.colorPrimary}
                    strokeWidth={TIMER_STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeDasharray={TIMER_CIRCUMFERENCE}
                    animatedProps={animatedProps}
                  />
                </Svg>
              </View>

              <Text variant="label" color={theme.colors.colorTextSecondary}>
                {isExpired ? t`Code expired` : t`Code expires in`}
              </Text>
              {!isExpired && (
                <Text variant="label" color={theme.colors.colorPrimary}>
                  {formattedTime}s
                </Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.vaultLinkSection,
              { borderTopColor: theme.colors.colorBorderPrimary }
            ]}
          >
            <View style={styles.vaultLinkContent}>
              <Text variant="caption" color={theme.colors.colorTextSecondary}>
                {t`Vault Link`}
              </Text>
              <Text numberOfLines={1} color={theme.colors.colorTextPrimary}>
                {vaultLink || t`Generating link...`}
              </Text>
            </View>
            <Pressable
              onPress={handleCopy}
              accessibilityLabel="Copy"
              testID="share-vault-copy-button"
              hitSlop={8}
            >
              <ContentCopy
                width={24}
                height={24}
                color={theme.colors.colorTextPrimary}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: rawTokens.spacing16
  },
  card: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing12,
    overflow: 'hidden'
  },
  qrSection: {
    padding: rawTokens.spacing16,
    alignItems: 'center',
    gap: rawTokens.spacing12
  },
  qrContainer: {
    width: 160,
    height: 160,
    borderRadius: rawTokens.spacing8,
    padding: 10,
    overflow: 'hidden'
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8
  },
  timerCircle: {
    width: TIMER_SIZE,
    height: TIMER_SIZE
  },
  timerSvg: {
    transform: [{ rotate: '-90deg' }]
  },
  vaultLinkSection: {
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing16,
    paddingLeft: rawTokens.spacing16,
    paddingRight: rawTokens.spacing8
  },
  vaultLinkContent: {
    flex: 1,
    gap: 2
  }
})
