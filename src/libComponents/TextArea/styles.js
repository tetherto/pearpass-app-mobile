import { StyleSheet, TextInput } from 'react-native'
import { colors } from 'src/utils/colors'

export const TextAreaComponent = ({ isFocused, disabled, style, ...rest }) => (
  <TextInput
    multiline
    placeholderTextColor={colors.grey100.mode1}
    textAlignVertical="top"
    editable={!disabled}
    {...rest}
    style={[
      styles.textArea,
      {
        borderColor: isFocused ? colors.primary400.mode1 : colors.grey100.mode1
      },
      style
    ]}
  />
)

const styles = StyleSheet.create({
  textArea: {
    width: '100%',
    height: 233,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: colors.grey400.mode1,
    color: colors.white.mode1
  }
})
