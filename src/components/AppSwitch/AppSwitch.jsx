import { useEffect } from 'react'

import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { useHapticFeedback } from '../../hooks/useHapticFeedback'

const SWITCH_WIDTH = 50
const SWITCH_HEIGHT = 28
const THUMB_SIZE = 24
const ANIMATION_DURATION = 200

export const AppSwitch = ({
  trackColorTrue = colors.primary300.mode1,
  trackColorFalse = colors.grey300.mode1,
  thumbColor = colors.white.mode1,
  disabled,
  onChange,
  style,
  value,
  testID,
  testIDOn,
  testIDOff,
  accessibilityLabel,
  accessibilityLabelOn,
  accessibilityLabelOff
}) => {
  const progress = useSharedValue(value ? 1 : 0)
  const { hapticToggle } = useHapticFeedback()

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: ANIMATION_DURATION })
  }, [value])

  const handlePress = () => {
    if (disabled) return
    hapticToggle()
    onChange?.(!value)
  }

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [trackColorFalse, trackColorTrue]
    )
    return { backgroundColor }
  })

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [2, SWITCH_WIDTH - THUMB_SIZE - 2]
    )
    return { transform: [{ translateX }] }
  })

  const resolvedTestID = testID || (value ? testIDOn : testIDOff)
  const resolvedAccessibilityLabel =
    accessibilityLabel || (value ? accessibilityLabelOn : accessibilityLabelOff)

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      testID={resolvedTestID}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={resolvedAccessibilityLabel}
    >
      <Animated.View
        style={[
          styles.track,
          trackAnimatedStyle,
          disabled && styles.disabled,
          style
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: thumbColor },
            thumbAnimatedStyle
          ]}
        />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    justifyContent: 'center'
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2
  },
  disabled: {
    opacity: 0.5
  }
})
