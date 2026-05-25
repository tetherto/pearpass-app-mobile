import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors } from 'src/utils/colors'

export const Wrapper = (props) => (
  <View {...props} style={[styles.wrapper, props.style]} />
)

export const Container = ({ isOpen, style, ...rest }) => (
  <TouchableOpacity
    {...rest}
    style={[
      styles.container,
      { borderColor: isOpen ? colors.primary400.mode1 : 'transparent' },
      style
    ]}
  />
)

export const ArrowIconWrapper = (props) => (
  <View {...props} style={[styles.arrowIconWrapper, props.style]} />
)

export const DropdownWrapper = (props) => (
  <Animated.View {...props} style={[styles.dropdownWrapper, props.style]} />
)

export const Dropdown = (props) => (
  <View {...props} style={[styles.dropdown, props.style]} />
)

export const DropdownItem = (props) => (
  <TouchableOpacity {...props} style={[styles.dropdownItem, props.style]} />
)

export const DropdownItemText = (props) => (
  <Text {...props} style={[styles.dropdownItemText, props.style]} />
)

export const CreateVaultButton = (props) => (
  <TouchableOpacity
    {...props}
    style={[styles.createVaultButton, props.style]}
  />
)

export const CreateVaultText = (props) => (
  <Text {...props} style={[styles.createVaultText, props.style]} />
)

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center'
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.black.mode1,
    borderWidth: 1,
    zIndex: 3
  },
  arrowIconWrapper: {
    marginLeft: 'auto'
  },
  dropdownWrapper: {
    overflow: 'hidden',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    width: '100%',
    backgroundColor: colors.black.mode1,
    marginTop: -10,
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10
  },
  dropdown: {
    maxHeight: 143,
    width: '100%',
    marginTop: 10
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.grey500.mode1
  },
  dropdownItemText: {
    color: colors.white.mode1,
    fontSize: 16,
    fontWeight: '700'
  },
  createVaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.grey500.mode1
  },
  createVaultText: {
    color: colors.primary400.mode1,
    fontSize: 14,
    fontWeight: '700'
  }
})
