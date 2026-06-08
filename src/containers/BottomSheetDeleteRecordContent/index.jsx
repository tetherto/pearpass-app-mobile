import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ContextMenu,
  ListItem,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { useRecords } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { RecordItemIcon } from '../../components/RecordItemIcon'
import { getRecordSubtitle } from '../../utils/getRecordSubtitle'

/**
 * Single-item delete confirmation bottom sheet. Controlled via `open` /
 * `onOpenChange` (rendered without a trigger), so the caller opens it after
 * dismissing the record actions menu.
 *
 * @param {{
 *  record?: object
 *  open: boolean
 *  onOpenChange: (open: boolean) => void
 *  onDeleted?: () => void
 * }} props
 */
export const BottomSheetDeleteRecordContent = ({
  record,
  open,
  onOpenChange,
  onDeleted
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()

  const { deleteRecords } = useRecords({
    onCompleted: () => {
      onOpenChange?.(false)
      onDeleted?.()
    }
  })

  const handleDelete = () => {
    if (record?.id) {
      deleteRecords([record.id])
    }
  }

  return (
    <ContextMenu open={open} onOpenChange={onOpenChange}>
      <View
        style={[
          styles.content,
          { paddingBottom: bottom + rawTokens.spacing12 }
        ]}
      >
        <Text variant="bodyEmphasized">{t`Delete Item`}</Text>

        {record && (
          <ListItem
            icon={<RecordItemIcon record={record} />}
            iconSize={32}
            title={record.data?.title ?? ''}
            subtitle={getRecordSubtitle(record) || undefined}
          />
        )}

        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Are you sure you want to delete this item?`}
        </Text>

        <View style={styles.actions}>
          <Button
            variant="destructive"
            size="medium"
            fullWidth
            onClick={handleDelete}
            testID="delete-record-confirm"
          >
            {t`Delete Item`}
          </Button>
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={() => onOpenChange?.(false)}
            testID="delete-record-cancel"
          >
            {t`Cancel`}
          </Button>
        </View>
      </View>
    </ContextMenu>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing8,
    gap: rawTokens.spacing16
  },
  actions: {
    gap: rawTokens.spacing8
  }
})
