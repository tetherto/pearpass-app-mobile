import { Trans } from '@lingui/react/macro'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider'
import { StyleSheet, Text, View } from 'react-native'

export const ErrorScreen = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>
      <Trans>Something went wrong. Please restart the app.</Trans>
    </Text>
  </View>
)

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey500.mode1
  },
  errorText: {
    color: colors.errorRed.mode1,
    fontSize: 18
  }
})
