import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

export const Button = ({ size, stretch, disabled, style, ...rest }) => (
  <TouchableOpacity
    disabled={disabled}
    {...rest}
    style={[
      styles.button,
      size === 'sm' ? styles.sm : styles.md,
      stretch && styles.stretch,
      disabled && styles.disabled,
      style
    ]}
  />
)

export const ButtonText = ({ size, style, ...rest }) => (
  <Text
    {...rest}
    style={[
      styles.buttonText,
      size === 'sm' ? styles.textSm : styles.textMd,
      style
    ]}
  />
)

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    borderColor: colors.primary400.mode1,
    backgroundColor: colors.grey500.mode1,
    alignSelf: 'flex-start',
    width: 'auto'
  },
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 2
  },
  stretch: {
    alignSelf: 'stretch',
    width: '100%'
  },
  disabled: {
    opacity: 0.6
  },
  buttonText: {
    color: colors.white.mode1,
    fontFamily: 'Inter'
  },
  textSm: {
    fontSize: 12,
    fontWeight: '600'
  },
  textMd: {
    fontSize: 16,
    fontWeight: '500'
  }
})
