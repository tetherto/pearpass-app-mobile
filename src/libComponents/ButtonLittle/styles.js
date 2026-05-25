import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

export const Button = ({ borderRadius, variant, style, ...rest }) => (
  <TouchableOpacity
    {...rest}
    style={[
      styles.button,
      borderRadius === 'sm' ? styles.borderSm : styles.borderMd,
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
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: 10
  },
  borderSm: {
    borderRadius: 15,
    padding: 10
  },
  borderMd: {
    borderRadius: 25,
    padding: 7
  },
  buttonPrimary: {
    backgroundColor: colors.primary400.mode1,
    borderWidth: 1,
    borderColor: colors.primary300.mode1
  },
  buttonSecondary: {
    backgroundColor: colors.black.mode1,
    borderWidth: 1,
    borderColor: colors.black.mode1
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400'
  },
  buttonTextPrimary: {
    color: colors.black.mode1
  },
  buttonTextSecondary: {
    color: colors.primary400.mode1
  }
})
