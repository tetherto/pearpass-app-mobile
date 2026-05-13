import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  row: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden'
  },
  buttonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  }
})
