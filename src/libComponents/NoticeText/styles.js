import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/utils/colors'

const typeColor = (type) => {
  switch (type) {
    case 'success':
      return colors.primary400.mode1
    case 'error':
      return colors.errorRed.dark
    case 'warning':
      return colors.errorYellow.mode1
    default:
      return colors.white.mode1
  }
}

export const NoticeTextWrapper = (props) => (
  <View {...props} style={[styles.wrapper, props.style]} />
)

export const NoticeTextComponent = ({ type, style, ...rest }) => (
  <Text {...rest} style={[styles.text, { color: typeColor(type) }, style]} />
)

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500'
  }
})
