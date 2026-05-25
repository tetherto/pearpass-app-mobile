import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const ListItemContainer = (props) => (
  <TouchableOpacity
    {...props}
    style={[styles.listItemContainer, props.style]}
  />
)

export const SelectedListItemIconContainer = (props) => (
  <View
    {...props}
    style={[styles.selectedListItemIconContainer, props.style]}
  />
)

export const ListItemInfo = (props) => (
  <View {...props} style={[styles.listItemInfo, props.style]} />
)

export const ListItemDescription = (props) => (
  <View {...props} style={[styles.listItemDescription, props.style]} />
)

export const ListItemName = (props) => (
  <Text
    numberOfLines={1}
    ellipsizeMode="tail"
    {...props}
    style={[styles.listItemName, props.style]}
  />
)

export const ListItemDate = (props) => (
  <Text {...props} style={[styles.listItemDate, props.style]} />
)

export const ListItemActions = (props) => (
  <View {...props} style={[styles.listItemActions, props.style]} />
)

const styles = StyleSheet.create({
  listItemContainer: {
    minWidth: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey100.mode1
  },
  selectedListItemIconContainer: {
    width: 30,
    height: 30,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: colors.primary400.mode1
  },
  listItemInfo: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  listItemDescription: {
    gap: -2,
    flex: 1
  },
  listItemName: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    width: '80%'
  },
  listItemDate: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '300'
  },
  listItemActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  }
})
