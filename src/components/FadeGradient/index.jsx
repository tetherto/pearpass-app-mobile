import { useId, useState } from 'react'

import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

export const FadeGradient = ({ color, style }) => {
  const rawId = useId()
  const fadeId = `fg${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const [height, setHeight] = useState(0)

  return (
    <View
      style={style}
      pointerEvents="none"
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
    >
      {height > 0 && (
        <Svg width="100%" height={Math.ceil(height)}>
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
            height={Math.ceil(height)}
            fill={`url(#${fadeId})`}
          />
        </Svg>
      )}
    </View>
  )
}
