import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const FolderWrapper = ({ last, style, ...rest }) => (
  <TouchableOpacity
    {...rest}
    style={[
      styles.folderWrapper,
      { borderBottomColor: last ? 'transparent' : colors.grey100.mode1 },
      style
    ]}
  />
)

export const FolderContainer = (props) => (
  <View {...props} style={[styles.folderContainer, props.style]} />
)

export const FolderContent = (props) => (
  <View {...props} style={[styles.folderContent, props.style]} />
)

export const FolderText = (props) => (
  <Text
    numberOfLines={1}
    ellipsizeMode="tail"
    {...props}
    style={[styles.folderText, props.style]}
  />
)

export const FolderCount = (props) => (
  <Text {...props} style={[styles.folderCount, props.style]} />
)

const styles = StyleSheet.create({
  folderWrapper: {
    backgroundColor: colors.grey500.mode1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  folderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  folderContent: {
    paddingLeft: 16,
    flex: 1
  },
  folderText: {
    fontSize: 20,
    fontFamily: 'Inter',
    color: '#fff'
  },
  folderCount: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: colors.grey100.mode1
  }
})
