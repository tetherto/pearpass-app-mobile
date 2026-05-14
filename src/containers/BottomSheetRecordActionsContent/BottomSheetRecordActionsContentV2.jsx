import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import {
  Button,
  ContextMenu,
  NavbarListItem,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  ContentCopy,
  DriveFileMoveOutlined,
  EditOutlined,
  MoreVert,
  StarBorder,
  StarFilled,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRecordActionItems } from '../../hooks/useRecordActionItems'

const ACTION_ICON_BY_TYPE = {
  copy: ContentCopy,
  move: DriveFileMoveOutlined,
  edit: EditOutlined,
  delete: TrashOutlined
}

const getActionIcon = (action, isFavorite, theme) => {
  if (action.type === 'favorite') {
    const FavoriteIcon = isFavorite ? StarFilled : StarBorder

    return <FavoriteIcon color={theme.colors.colorTextPrimary} />
  }

  const Icon = ACTION_ICON_BY_TYPE[action.type] || MoreVert
  const iconColor =
    action.type === 'delete'
      ? theme.colors.colorSurfaceDestructiveElevated
      : theme.colors.colorTextPrimary

  return <Icon color={iconColor} />
}

export const BottomSheetRecordActionsContentV2 = ({
  recordType,
  record,
  excludeTypes,
  onDelete,
  isOtpContext
}) => {
  const { actions } = useRecordActionItems({
    excludeTypes,
    record,
    recordType,
    onDelete,
    isOtpContext
  })
  const { theme } = useTheme()
  const { dismiss } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()

  return (
    <ContextMenu
      trigger={
        <Button
          variant="tertiary"
          size="medium"
          aria-label="More actions"
          iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
        />
      }
      testID="record-actions-bottom-sheet-v2"
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
        <View style={styles.list}>
          {actions.map((action, index) => (
            <NavbarListItem
              key={action.name}
              platform="mobile"
              label={action.name}
              icon={getActionIcon(action, record?.isFavorite, theme)}
              variant={action.type === 'delete' ? 'destructive' : 'default'}
              showDivider={index < actions.length - 1}
              onClick={() => {
                dismiss()
                action.click?.()
              }}
            />
          ))}
        </View>
      </View>
    </ContextMenu>
  )
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingTop: rawTokens.spacing8
  },
  list: {
    overflow: 'hidden'
  }
})
