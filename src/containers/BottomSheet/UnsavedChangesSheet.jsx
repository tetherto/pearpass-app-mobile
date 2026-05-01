import { useLingui } from '@lingui/react/macro'
import { Button, Text, rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SheetHeader } from './SheetHeader'

export const UnsavedChangesSheet = ({
  onSave,
  onDiscard,
  onClose,
  title,
  description,
  saveLabel,
  discardLabel
}) => {
  const { t } = useLingui()
  const { bottom } = useSafeAreaInsets()

  return (
    <View>
      <SheetHeader
        showHandle
        title={title ?? t`Unsaved Changes`}
        onClose={onClose}
      />
      <View
        style={[styles.body, { paddingBottom: bottom + rawTokens.spacing16 }]}
      >
        <Text as="p" variant="body">
          {description ??
            t`You have unsaved changes. Would you like to save them before leaving?`}
        </Text>

        <View style={styles.actions}>
          <Button variant="primary" fullWidth onClick={onSave}>
            {saveLabel ?? t`Save Changes`}
          </Button>
          <Button variant="secondary" fullWidth onClick={onDiscard}>
            {discardLabel ?? t`Discard`}
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
