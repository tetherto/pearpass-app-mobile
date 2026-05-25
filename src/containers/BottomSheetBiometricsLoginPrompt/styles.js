import { StyleSheet, Text, View } from 'react-native'
import { colors } from 'src/utils/colors'

export const Header = (props) => (
  <View {...props} style={[styles.header, props.style]} />
)

export const Title = (props) => (
  <Text {...props} style={[styles.title, props.style]} />
)

export const ContentWrapper = (props) => (
  <View {...props} style={[styles.contentWrapper, props.style]} />
)

export const BottomSheetBody = (props) => (
  <Text {...props} style={[styles.bottomSheetBody, props.style]} />
)

export const ActionsWrapper = (props) => (
  <View {...props} style={[styles.actionsWrapper, props.style]} />
)

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20
  },
  title: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500'
  },
  contentWrapper: {
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  bottomSheetBody: {
    textAlign: 'center',
    color: colors.white.mode1,
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 5
  },
  actionsWrapper: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    paddingTop: 20
  }
})
