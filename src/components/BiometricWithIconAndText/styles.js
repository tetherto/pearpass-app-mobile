import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

export const Wrapper = (props) => (
  <TouchableOpacity {...props} style={[styles.wrapper, props.style]} />
)

export const PressableText = (props) => (
  <Text {...props} style={[styles.pressableText, props.style]} />
)

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    alignSelf: 'center'
  },
  pressableText: {
    color: colors.primary400.mode1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '400'
  }
})
