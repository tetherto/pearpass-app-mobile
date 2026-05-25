import { KeyboardAvoidingView, StyleSheet } from 'react-native'

export const KeyboardAvoid = (props) => (
  <KeyboardAvoidingView
    {...props}
    style={[styles.keyboardAvoid, props.style]}
  />
)

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1
  }
})
