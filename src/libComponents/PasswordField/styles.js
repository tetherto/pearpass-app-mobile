import { PASSWORD_STRENGTH } from '@tetherto/pearpass-utils-password-check'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/utils/colors'

const strengthColor = (strength) => {
  switch (strength) {
    case PASSWORD_STRENGTH.SAFE:
      return colors.primary400.mode1
    case PASSWORD_STRENGTH.VULNERABLE:
      return colors.errorRed.dark
    case PASSWORD_STRENGTH.WEAK:
      return colors.errorYellow.mode1
    default:
      return colors.white.mode1
  }
}

export const PasswordStrongnessWrapper = (props) => (
  <View {...props} style={[styles.wrapper, props.style]} />
)

export const PasswordText = ({ strength, style, ...rest }) => (
  <Text
    {...rest}
    style={[styles.text, { color: strengthColor(strength) }, style]}
  />
)

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    gap: 5
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '500'
  }
})
