import {
  ScrollView as RNScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors } from 'src/utils/colors'

export const DrawerContainer = (props) => (
  <View {...props} style={[styles.drawerContainer, props.style]} />
)

export const LoadingWrapper = (props) => (
  <View {...props} style={[styles.loadingWrapper, props.style]} />
)

export const DrawerTitle = (props) => (
  <Text {...props} style={[styles.drawerTitle, props.style]} />
)

export const ScrollContainer = (props) => (
  <View {...props} style={[styles.scrollContainer, props.style]} />
)

export const ScrollView = (props) => (
  <RNScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    {...props}
    style={[styles.scrollView, props.style]}
  />
)

export const ActionsContainer = (props) => (
  <View {...props} style={[styles.actionsContainer, props.style]} />
)

export const AddDevice = (props) => (
  <TouchableOpacity {...props} style={[styles.addDevice, props.style]} />
)

export const AddDeviceText = (props) => (
  <Text {...props} style={[styles.addDeviceText, props.style]} />
)

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.grey500.mode1,
    paddingTop: '25%',
    paddingBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 15,
    height: '100%'
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerTitle: {
    paddingTop: '5%',
    paddingLeft: 16,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#f6f6f6',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 32
  },
  scrollContainer: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  actionsContainer: {
    gap: 15
  },
  addDevice: {
    left: 24,
    backgroundColor: '#050b06',
    width: 160,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    gap: 10
  },
  addDeviceText: {
    color: colors.primary400.mode1,
    paddingTop: 2
  }
})
