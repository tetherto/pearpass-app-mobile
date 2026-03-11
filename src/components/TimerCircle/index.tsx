import { useEffect } from 'react'

import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useTimerAnimation } from 'pearpass-lib-vault'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

import {
  getTimerColor,
  TIMER_ANIMATION_DURATION
} from '../OtpCodeField/utils'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const SIZE = 14
const RADIUS = 5.5
const STROKE_WIDTH = 1.5
const CENTER = SIZE / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface TimerCircleProps {
  timeRemaining: number | null
  period: number
}

export const TimerCircle = ({ timeRemaining, period }: TimerCircleProps) => {
  const { noTransition, expiring, targetTime } = useTimerAnimation(
    timeRemaining,
    period
  )

  const targetOffset =
    timeRemaining !== null ? (1 - targetTime / period) * CIRCUMFERENCE : 0

  const animatedOffset = useSharedValue(targetOffset)

  useEffect(() => {
    if (noTransition) {
      animatedOffset.value = targetOffset
    } else {
      animatedOffset.value = withTiming(targetOffset, {
        duration: TIMER_ANIMATION_DURATION,
        easing: Easing.linear
      })
    }
  }, [targetOffset, noTransition])

  const color = getTimerColor(expiring)
  const bgColor = `${colors.grey100.mode1}33`

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value
  }))

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={bgColor}
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  )
}
