import { Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import * as NavigationBar from 'expo-navigation-bar'
import { StatusBar } from 'expo-status-bar'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg'

import { LogoTextWithLock } from '../../../svgs/LogoTextWithLock'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export const OnboardingLayout = ({
  children,
  showLogo = true,
  rightAction,
  avoidBottomInset = false,
  topGradient = false
}) => {
  const { theme } = useTheme()
  const backgroundColor = theme.colors.colorSurfacePrimary

  const topGradientColors = [
    { color: '#3A4A1A', offset: '0%' },
    { color: backgroundColor, offset: '100%', opacity: 0 }
  ]
  const insets = useSafeAreaInsets()

  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync(backgroundColor)
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingBottom: avoidBottomInset ? 0 : insets.bottom + 8
        }
      ]}
      testID="onboarding-v2-layout"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      {topGradient && (
        <View style={styles.topGradientWrapper}>
          <Svg
            width={SCREEN_WIDTH * 3}
            height={SCREEN_WIDTH * 1.5}
            style={styles.topGradientSvg}
          >
            <Defs>
              <RadialGradient id="topGrad" cx="50%" cy="0%" rx="70%" ry="60%">
                {topGradientColors.map((stop, i) => (
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

      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === 'android' ? 24 : 16) }
        ]}
      >
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
    flex: 1
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
