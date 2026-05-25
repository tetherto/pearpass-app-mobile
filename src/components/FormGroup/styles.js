import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const Wrapper = (props) => (
  <View {...props} style={[styles.wrapper, props.style]} />
)

export const TitleWrapper = (props) => (
  <TouchableOpacity {...props} style={[styles.titleWrapper, props.style]} />
)

export const Title = (props) => (
  <Text {...props} style={[styles.title, props.style]} />
)

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'column',
    gap: 10
  },
  titleWrapper: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },
  title: {
    color: colors.grey100.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    alignSelf: 'flex-start'
  }
})
