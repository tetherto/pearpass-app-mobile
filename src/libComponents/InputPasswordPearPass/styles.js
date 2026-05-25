import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { colors } from 'src/utils/colors'

export const InputWrapper = ({ isFocused, isPassword, style, ...rest }) => (
  <TouchableOpacity
    {...rest}
    style={[
      styles.inputWrapper,
      {
        borderColor: isFocused ? colors.primary400.mode1 : colors.grey100.mode1
      },
      isPassword ? styles.paddingPassword : styles.paddingDefault,
      style
    ]}
  />
)

export const Input = (props) => (
  <TextInput
    placeholderTextColor={colors.grey100.mode1}
    {...props}
    style={[styles.input, props.style]}
  />
)

export const IconWrapper = (props) => (
  <View {...props} style={[styles.iconWrapper, props.style]} />
)

export const MainWrapper = (props) => (
  <View {...props} style={[styles.mainWrapper, props.style]} />
)

export const ErrorMessageWrapper = (props) => (
  <View {...props} style={[styles.errorMessageWrapper, props.style]} />
)

export const ErrorMessage = (props) => (
  <Text {...props} style={[styles.errorMessage, props.style]} />
)

export const AdditionalItems = (props) => (
  <View {...props} style={[styles.additionalItems, props.style]} />
)

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    width: '100%',
    position: 'relative',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'transparent'
  },
  paddingPassword: {
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  paddingDefault: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  input: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400'
  },
  iconWrapper: {
    flexShrink: 0
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  errorMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2
  },
  errorMessage: {
    color: colors.errorRed.dark,
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '500'
  },
  additionalItems: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'center'
  }
})
