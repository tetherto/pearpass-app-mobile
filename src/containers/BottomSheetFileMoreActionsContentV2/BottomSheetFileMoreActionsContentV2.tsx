import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import {
  Button,
  ContextMenu,
  InputField,
  NavbarListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Close,
  EditOutlined,
  MoreVert,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styles } from './BottomSheetFileMoreActionsContentV2Styles'

const imageRegex = /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif|tiff?)$/i

interface BottomSheetFileMoreActionsContentV2Props {
  handleDelete: () => void
  handleRename: (newName: string) => void
  filename: string
}

export const BottomSheetFileMoreActionsContentV2 = ({
  handleDelete,
  handleRename,
  filename
}: BottomSheetFileMoreActionsContentV2Props) => {
  const [name, setName] = useState(filename)
  const [state, setState] = useState<'default' | 'renaming' | 'deleting'>(
    'default'
  )
  const { t } = useLingui()

  const isImage = imageRegex.test(filename)

  const { theme } = useTheme()
  const { dismiss } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()

  return (
    <ContextMenu
      trigger={
        <Button
          variant="tertiary"
          size="medium"
          aria-label="More options"
          iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
        />
      }
    >
      {state === 'default' && (
        <View style={{ paddingBottom: bottom }}>
          <NavbarListItem
            label="Rename"
            onClick={() => setState('renaming')}
            icon={<EditOutlined color={theme.colors.colorTextPrimary} />}
            showDivider
          />
          <NavbarListItem
            label="Delete"
            variant="destructive"
            onClick={() => {
              setState('deleting')
            }}
            icon={
              <TrashOutlined
                color={theme.colors.colorSurfaceDestructiveElevated}
              />
            }
            showDivider
          />
        </View>
      )}

      {state === 'deleting' && (
        <View style={[styles.container, { paddingBottom: bottom }]}>
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Text variant="bodyEmphasized">
                {isImage ? t`Delete Image` : t`Delete File`}
              </Text>
            </View>
            <Button
              variant="tertiary"
              size="medium"
              aria-label="More options"
              iconBefore={<Close color={theme.colors.colorTextPrimary} />}
              onClick={() => setState('default')}
            />
          </View>
          <View style={styles.content}>
            <Text variant="bodyEmphasized">
              {isImage
                ? t`Are you sure you want to delete this image?`
                : t`Are you sure you want to delete this file?`}
            </Text>
            <Button
              variant="destructive"
              size="medium"
              onClick={() => {
                handleDelete()
                setState('default')
                dismiss()
              }}
            >
              {t`Delete`}
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setState('default')}
            >
              {t`Discard`}
            </Button>
          </View>
        </View>
      )}

      {state === 'renaming' && (
        <View style={[styles.container, { paddingBottom: bottom }]}>
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Text variant="bodyEmphasized">
                {isImage ? t`Rename Image` : t`Rename File`}
              </Text>
            </View>
            <Button
              variant="tertiary"
              size="medium"
              aria-label="More options"
              iconBefore={<Close color={theme.colors.colorTextPrimary} />}
              onClick={() => setState('default')}
            />
          </View>
          <View style={styles.content}>
            <InputField
              label={isImage ? t`Image Name` : t`File Name`}
              onChangeText={setName}
              value={name || ''}
            />
            <Button
              variant="primary"
              size="medium"
              onClick={() => {
                handleRename(name || '')
                setState('default')
                dismiss()
              }}
            >
              {t`Save`}
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setState('default')}
            >
              {t`Discard`}
            </Button>
          </View>
        </View>
      )}
    </ContextMenu>
  )
}
