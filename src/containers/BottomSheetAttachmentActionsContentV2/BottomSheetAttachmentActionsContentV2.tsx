import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { ReactNode } from 'react'
import { Button, ContextMenu, Text, rawTokens, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Close, EditOutlined, TrashOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const imageRegex = /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|tiff?)$/i

type Props = {
  filename: string
  onDelete: () => void
  showEditButton?: boolean
  onEdit?: () => void
  editTrigger?: ReactNode
}

export const BottomSheetAttachmentActionsContentV2 = ({
  filename,
  onDelete,
  showEditButton = true,
  onEdit,
  editTrigger
}: Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { dismiss } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()
  const isImage = imageRegex.test(filename)
  const deleteTitle = isImage ? t`Delete Image` : t`Delete File`
  const deleteDescription = isImage
    ? t`Are you sure you want to delete this image?`
    : t`Are you sure you want to delete this file?`

  return (
    <View style={styles.container}>
      {showEditButton && (editTrigger || onEdit) ? (
        editTrigger ?? (
          <Button
            size="small"
            variant="tertiary"
            aria-label="Edit attachment"
            iconBefore={<EditOutlined color={theme.colors.colorTextPrimary} />}
            onClick={onEdit}
          />
        )
      ) : null}

      <ContextMenu
        trigger={
          <Button
            size="small"
            variant="destructive"
            aria-label="Delete attachment"
            iconBefore={
              <TrashOutlined color={theme.colors.colorTextPrimary} />
            }
          />
        }
      >
        <View
          style={[
            styles.sheetContent,
            {
              backgroundColor: theme.colors.colorSurfacePrimary,
              paddingBottom: bottom + rawTokens.spacing12
            }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Text variant="bodyEmphasized">{deleteTitle}</Text>
            </View>

            <Button
              variant="tertiary"
              size="medium"
              aria-label="Close delete confirmation"
              iconBefore={<Close color={theme.colors.colorTextPrimary} />}
              onClick={() => dismiss()}
            />
          </View>

          <View style={styles.content}>
            <Text variant="bodyEmphasized">{deleteDescription}</Text>

            <View style={styles.actions}>
              <Button
                variant="destructive"
                size="medium"
                onClick={() => {
                  onDelete()
                  dismiss()
                }}
              >
                {deleteTitle}
              </Button>

              <Button variant="secondary" size="medium" onClick={() => dismiss()}>
                {t`Discard`}
              </Button>
            </View>
          </View>
        </View>
      </ContextMenu>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    flexShrink: 0
  },
  sheetContent: {
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing8,
    gap: rawTokens.spacing8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  content: {
    gap: rawTokens.spacing16
  },
  actions: {
    gap: rawTokens.spacing12
  }
})
