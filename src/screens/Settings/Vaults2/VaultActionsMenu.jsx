import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { PROTECTED_VAULT_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  Button,
  ContextMenu,
  NavbarListItem,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  EditOutlined,
  Key,
  MoreVert,
  PersonAdd,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const isManageMembersEnabled = false
const isDeleteEnabled = false

export const VaultActionsMenu = ({
  onRename,
  onManageMembers,
  onSetPassword,
  onDelete
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { dismiss } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()

  const closeAndRun = (action) => {
    dismiss()
    action()
  }

  return (
    <ContextMenu
      trigger={
        <Button
          variant="tertiary"
          size="small"
          iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
        />
      }
    >
      <View style={{ paddingBottom: bottom }}>
        <NavbarListItem
          platform="mobile"
          icon={<EditOutlined color={theme.colors.colorTextPrimary} />}
          label={t`Rename`}
          showDivider
          onClick={() => closeAndRun(onRename)}
        />
        {isManageMembersEnabled && (
          <NavbarListItem
            platform="mobile"
            icon={<PersonAdd color={theme.colors.colorTextPrimary} />}
            label={t`Manage Members`}
            showDivider
            onClick={() => closeAndRun(onManageMembers)}
          />
        )}
        {PROTECTED_VAULT_ENABLED && (
          <NavbarListItem
            platform="mobile"
            icon={<Key color={theme.colors.colorTextPrimary} />}
            label={t`Set Vault Password`}
            showDivider
            onClick={() => closeAndRun(onSetPassword)}
          />
        )}
        {isDeleteEnabled && (
          <NavbarListItem
            platform="mobile"
            variant="destructive"
            icon={
              <TrashOutlined
                color={theme.colors.colorSurfaceDestructiveElevated}
              />
            }
            label={t`Delete Vault`}
            onClick={() => closeAndRun(onDelete)}
          />
        )}
      </View>
    </ContextMenu>
  )
}
