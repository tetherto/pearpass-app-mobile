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
        {[
          {
            key: 'rename',
            icon: <EditOutlined color={theme.colors.colorTextPrimary} />,
            label: t`Rename`,
            onClick: () => closeAndRun(onRename)
          },
          isManageMembersEnabled && {
            key: 'members',
            icon: <PersonAdd color={theme.colors.colorTextPrimary} />,
            label: t`Manage Members`,
            onClick: () => closeAndRun(onManageMembers)
          },
          PROTECTED_VAULT_ENABLED && {
            key: 'password',
            icon: <Key color={theme.colors.colorTextPrimary} />,
            label: t`Set Vault Password`,
            onClick: () => closeAndRun(onSetPassword)
          },
          isDeleteEnabled && {
            key: 'delete',
            icon: (
              <TrashOutlined
                color={theme.colors.colorSurfaceDestructiveElevated}
              />
            ),
            label: t`Delete Vault`,
            variant: 'destructive',
            onClick: () => closeAndRun(onDelete)
          }
        ]
          .filter(Boolean)
          .map((item, index, arr) => (
            <NavbarListItem
              key={item.key}
              platform="mobile"
              icon={item.icon}
              label={item.label}
              variant={item.variant}
              showDivider={index < arr.length - 1}
              onClick={item.onClick}
            />
          ))}
      </View>
    </ContextMenu>
  )
}
