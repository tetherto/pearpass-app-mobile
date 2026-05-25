import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

export const Button = ({ hasIcon, style, ...rest }) => (
  <TouchableOpacity
    {...rest}
    style={[
      styles.button,
      { justifyContent: hasIcon ? 'space-between' : 'center' },
      style
    ]}
  />
)

export const ButtonText = (props) => (
  <Text {...props} style={[styles.buttonText, props.style]} />
)

const styles = StyleSheet.create({
  button: {
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey100.mode1,
    backgroundColor: colors.primary300.mode1
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: colors.black.mode1
  }
})
