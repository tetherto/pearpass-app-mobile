import { useLingui } from '@lingui/react/macro'
import { Button, Text, rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SheetHeader } from './SheetHeader'

export const DeleteItemSheet = ({
  onConfirm,
  onDiscard,
  onClose,
  title,
  description,
  confirmLabel,
  discardLabel
}) => {
  const { t } = useLingui()
  const { bottom } = useSafeAreaInsets()

  return (
    <View>
      <SheetHeader
        showHandle
        title={title ?? t`Delete Item`}
        onClose={onClose}
      />
      <View
        style={[styles.body, { paddingBottom: bottom + rawTokens.spacing16 }]}
      >
        <Text as="p" variant="body">
          {description ?? t`Are you sure you want to delete this item?`}
        </Text>

        <View style={styles.actions}>
          <Button variant="destructive" fullWidth onClick={onConfirm}>
            {confirmLabel ?? t`Delete Item`}
          </Button>
          <Button variant="secondary" fullWidth onClick={onDiscard ?? onClose}>
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
