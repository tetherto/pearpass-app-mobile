import { useLingui } from '@lingui/react/macro'
import { APP_STORE_URL, PLAY_STORE_URL } from '@tetherto/pearpass-lib-constants'
import { Button, rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Linking, Platform, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const UpdateModalContent = () => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()

  const handleNavigation = () => {
    Linking.openURL(Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL)
  }

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.handleArea}>
        <View style={styles.handle} />
      </View>

      <View style={styles.body}>
        <Text
          style={[styles.title, { color: theme.colors.colorTextPrimary }]}
          numberOfLines={1}
        >
          {t`Update App`}
        </Text>

        <Text
          style={[
            styles.description,
            { color: theme.colors.colorTextSecondary }
          ]}
        >
          {t`A newer version of PearPass is available. Please update to the latest version to continue using the app.`}
        </Text>

        <View style={styles.footer}>
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onClick={handleNavigation}
          >
            {t`Update App`}
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: rawTokens.spacing12,
    paddingBottom: rawTokens.spacing12
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#2C3618'
  },
  body: {
    paddingHorizontal: rawTokens.spacing16
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: rawTokens.spacing16
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    alignSelf: 'stretch',
    marginBottom: rawTokens.spacing16
  },
  footer: {
    width: '100%'
  }
})
