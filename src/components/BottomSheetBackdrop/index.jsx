import { Animated, TouchableOpacity } from 'react-native'

export const BackDrop = ({
  animatedOpacity,
  onPress,
  testID,
  pointerEvents = 'auto'
}) => (
  <Animated.View
    pointerEvents={pointerEvents}
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      opacity: animatedOpacity
    }}
  >
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      testID={testID}
      style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    />
  </Animated.View>
)
