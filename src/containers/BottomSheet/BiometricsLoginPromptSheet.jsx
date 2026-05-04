import { useLingui } from '@lingui/react/macro'
import { Button, Text, rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SheetHeader } from './SheetHeader'

export const BiometricsLoginPromptSheet = ({
  title,
  description,
  onConfirm,
  onDismiss,
  onClose
}) => {
  const { t } = useLingui()
  const { bottom } = useSafeAreaInsets()

  return (
    <View>
      <SheetHeader showHandle title={title} onClose={onClose} />
      <View
        style={[styles.body, { paddingBottom: bottom + rawTokens.spacing16 }]}
      >
        <Text as="p" variant="body">
          {description}
        </Text>

        <View style={styles.actions}>
          <Button variant="primary" fullWidth onClick={onConfirm}>
            {t`Enable`}
          </Button>
          <Button variant="secondary" fullWidth onClick={onDismiss}>
            {t`Dismiss`}
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing8,
    gap: rawTokens.spacing24
  },
  actions: {
    gap: rawTokens.spacing12
  }
})
