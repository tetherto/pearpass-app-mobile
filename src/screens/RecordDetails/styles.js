import { StyleSheet, View } from 'react-native'

export const HeaderContent = (props) => (
  <View {...props} style={[styles.headerContent, props.style]} />
)

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    minWidth: 0
  }
})
