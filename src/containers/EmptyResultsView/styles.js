import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const Container = (props) => (
  <View {...props} style={[styles.container, props.style]} />
)

export const Title = (props) => (
  <Text {...props} style={[styles.title, props.style]} />
)

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 25,
    gap: 20,
    alignItems: 'center',
    alignSelf: 'center'
  },
  title: {
    color: colors.white.mode1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600'
  }
})
