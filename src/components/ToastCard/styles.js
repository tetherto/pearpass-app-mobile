import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const Container = (props) => (
  <View {...props} style={[styles.container, props.style]} />
)

export const ToastText = (props) => (
  <Text {...props} style={[styles.toastText, props.style]} />
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    borderRadius: 10,
    backgroundColor: colors.white.mode1
  },
  toastText: {
    color: colors.black.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400'
  }
})
