import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors } from 'src/utils/colors'

export const Button = (props) => (
  <TouchableOpacity {...props} style={[styles.button, props.style]} />
)

export const ButtonText = (props) => (
  <Text {...props} style={[styles.buttonText, props.style]} />
)

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 10,
    backgroundColor: colors.black.mode1,
    borderWidth: 1,
    borderColor: colors.black.mode1
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: colors.primary400.mode1
  }
})
