import { StyleSheet, View } from 'react-native'
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg'

/**
 * @param {{
 *  colors: Array<{ color: string, offset: string, opacity?: number }>,
 *  children: React.ReactNode,
 *  style?: object
 * }} props
 */
export const RadialGradientBackground = ({ colors, children, style }) => (
  <View style={[styles.container, style]}>
    <View style={styles.gradientWrapper}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%">
            {colors.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity ?? 1}
              />
            ))}
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
    {children}
  </View>
)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  gradientWrapper: {
    ...StyleSheet.absoluteFillObject,
    top: '-25%',
    left: '-25%',
    right: '-25%',
    bottom: '-25%'
  }
})
