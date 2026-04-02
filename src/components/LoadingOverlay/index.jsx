import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

export const LoadingOverlay = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary400.mode1} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
})
