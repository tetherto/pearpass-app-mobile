import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const Container = (props) => (
  <View {...props} style={[styles.container, props.style]} />
)

export const Header = (props) => (
  <View {...props} style={[styles.header, props.style]} />
)

export const Title = (props) => (
  <Text {...props} style={[styles.title, props.style]} />
)

export const Description = (props) => (
  <Text {...props} style={[styles.description, props.style]} />
)

export const Actions = (props) => (
  <View {...props} style={[styles.actions, props.style]} />
)

export const CloseButtonWrapper = (props) => (
  <View {...props} style={[styles.closeButtonWrapper, props.style]} />
)

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'column',
    width: '100%',
    gap: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey100.mode1,
    backgroundColor: colors.grey500.mode1,
    position: 'relative'
  },
  header: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10
  },
  title: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700'
  },
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400'
  },
  actions: {
    marginTop: 20,
    gap: 20
  },
  closeButtonWrapper: {
    position: 'absolute',
    right: 14,
    top: 14
  }
})
