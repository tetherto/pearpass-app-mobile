import { ScrollView as RNScrollView, StyleSheet } from 'react-native'
import { colors } from 'src/utils/colors'

export const FoldersContainer = (props) => (
  <RNScrollView {...props} style={[styles.foldersContainer, props.style]} />
)

const styles = StyleSheet.create({
  foldersContainer: {
    backgroundColor: colors.grey500.mode1,
    height: '100%'
  }
})
