import { useId } from 'react'

import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

export const FADE_GRADIENT_HEIGHT = 70

export const FadeGradient = ({ color, style }) => {
  const rawId = useId()
  const fadeId = `fg${rawId.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <View style={style} pointerEvents="none">
      <Svg width="100%" height={FADE_GRADIENT_HEIGHT}>
        <Defs>
          <LinearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0" />
            <Stop offset="1" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height={FADE_GRADIENT_HEIGHT}
          fill={`url(#${fadeId})`}
        />
      </Svg>
    </View>
  )
}
