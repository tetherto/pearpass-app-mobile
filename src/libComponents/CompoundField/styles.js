import { StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

export const CompoundFieldComponent = ({ isDisabled, style, ...rest }) => (
  <TouchableOpacity
    {...rest}
    style={[styles.compoundField, isDisabled && styles.disabled, style]}
  />
)

const styles = StyleSheet.create({
  compoundField: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey100.mode1,
    backgroundColor: colors.grey400.mode1
  },
  disabled: {
    opacity: 0.6
  }
})
