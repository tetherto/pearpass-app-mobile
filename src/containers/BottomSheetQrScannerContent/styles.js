import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const Container = (props) => (
  <View {...props} style={[styles.container, props.style]} />
)

export const CameraSpot = (props) => (
  <View {...props} style={[styles.cameraSpot, props.style]} />
)

export const GrantPermissionContainer = (props) => (
  <View {...props} style={[styles.grantPermissionContainer, props.style]} />
)

export const GrantPermissionText = (props) => (
  <Text {...props} style={[styles.grantPermissionText, props.style]} />
)

export const Title = (props) => (
  <Text {...props} style={[styles.title, props.style]} />
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20
  },
  cameraSpot: {
    width: 170,
    height: 170,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: colors.primary400.mode1,
    backgroundColor: 'transparent',
    marginVertical: 'auto',
    marginHorizontal: 'auto'
  },
  grantPermissionContainer: {
    gap: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  grantPermissionText: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500'
  },
  title: {
    marginVertical: 'auto',
    marginHorizontal: 'auto',
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '500'
  }
})
