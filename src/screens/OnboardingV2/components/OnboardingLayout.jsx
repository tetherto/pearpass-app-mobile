import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg'

import { LogoTextWithLock } from '../../../svgs/LogoTextWithLock'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const TOP_GRADIENT_COLORS = [
  { color: '#3A4A1A', offset: '0%' },
  { color: '#15180E', offset: '100%', opacity: 0 }
]

export const OnboardingLayout = ({
  children,
  showLogo = true,
  rightAction,
  avoidBottomInset = false,
  topGradient = false
}) => {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: avoidBottomInset ? 0 : insets.bottom + 8
        }
      ]}
      testID="onboarding-v2-layout"
    >
      {topGradient && (
        <View style={styles.topGradientWrapper}>
          <Svg
            width={SCREEN_WIDTH * 3}
            height={SCREEN_WIDTH * 1.5}
            style={styles.topGradientSvg}
          >
            <Defs>
              <RadialGradient id="topGrad" cx="50%" cy="0%" rx="70%" ry="60%">
                {TOP_GRADIENT_COLORS.map((stop, i) => (
                  <Stop
                    key={i}
                    offset={stop.offset}
                    stopColor={stop.color}
                    stopOpacity={stop.opacity ?? 1}
                  />
                ))}
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#topGrad)" />
          </Svg>
        </View>
      )}

      <View style={styles.header}>
        {showLogo && (
          <View style={styles.logoContainer} testID="onboarding-v2-logo">
            <LogoTextWithLock width={120} />
          </View>
        )}
        {rightAction && (
          <TouchableOpacity
            style={styles.rightAction}
            onPress={rightAction.onPress}
            testID="onboarding-v2-right-action"
          >
            <Text style={styles.rightActionText}>{rightAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // TODO: add this color to the theme provider
    backgroundColor: '#15180E'
  },
  topGradientWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 0
  },
  topGradientSvg: {
    marginTop: -SCREEN_WIDTH * 0.15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    zIndex: 10
  },
  logoContainer: {
    alignSelf: 'center'
  },
  rightAction: {
    position: 'absolute',
    right: 20
  },
  rightActionText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: colors.white.mode1,
    top: 26
  },
  content: {
    flex: 1,
    zIndex: 1
  }
})
