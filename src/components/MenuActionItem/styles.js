import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const MenuItemWrapper = ({ last, style, ...rest }) => (
  <View
    {...rest}
    style={[
      styles.menuItemWrapper,
      { borderBottomColor: last ? 'transparent' : colors.grey100.mode1 },
      style
    ]}
  />
)

export const MenuItemContainer = (props) => (
  <TouchableOpacity
    {...props}
    style={[styles.menuItemContainer, props.style]}
  />
)

export const ItemContainer = (props) => (
  <View {...props} style={[styles.itemContainer, props.style]} />
)

export const RecordText = (props) => (
  <Text {...props} style={[styles.recordText, props.style]} />
)

export const MenuItemRightSide = (props) => (
  <View {...props} style={[styles.menuItemRightSide, props.style]} />
)

const styles = StyleSheet.create({
  menuItemWrapper: {
    paddingBottom: 16,
    paddingRight: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  menuItemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  recordText: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: colors.white.mode1
  },
  menuItemRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  }
})
