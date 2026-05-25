import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

export const Button = ({ variant, isDisabled, style, ...rest }) => (
  <TouchableOpacity
    activeOpacity={isDisabled ? 1 : 0.7}
    {...rest}
    style={[
      styles.button,
      isDisabled && styles.buttonDisabled,
      variant === 'primary' && styles.buttonPrimary,
      variant === 'secondary' && styles.buttonSecondary,
      style
    ]}
  />
)

export const ButtonText = ({ variant, style, ...rest }) => (
  <Text
    {...rest}
    style={[
      styles.buttonText,
      variant === 'primary'
        ? styles.buttonTextPrimary
        : styles.buttonTextSecondary,
      style
    ]}
  />
)

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    padding: 4,
    borderRadius: 5,
    opacity: 1
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonPrimary: {
    backgroundColor: colors.secondary200.mode1
  },
  buttonSecondary: {
    borderRadius: 10,
    backgroundColor: colors.grey500.mode1,
    padding: 10
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400'
  },
  buttonTextPrimary: {
    color: colors.secondary400.mode1
  },
  buttonTextSecondary: {
    color: colors.white.mode1
  }
})
