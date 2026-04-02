import { useLingui } from '@lingui/react/macro'
import { NavbarListItem, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Check,
  ContentCopy,
  DriveFileMoveOutlined,
  EditOutlined,
  Share,
  StarOutlined,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useRecordActionItems } from '../../hooks/useRecordActionItems'
import { ContentContainer } from '../ContentContainer'

export const BottomSheetRecordActionsContentV2 = ({
  record,
  recordType,
  onDelete,
  onSelectItem
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse } = useBottomSheet()

  const { actions } = useRecordActionItems({ record, recordType, onDelete })

  const editAction = actions.find((a) => a.type === 'edit')
  const favoriteAction = actions.find((a) => a.type === 'favorite')
  const moveAction = actions.find((a) => a.type === 'move')
  const deleteAction = actions.find((a) => a.type === 'delete')

  const handleSelectItem = () => {
    collapse()
    onSelectItem?.()
  }

  const actionItems = [
    {
      icon: EditOutlined,
      label: t`Edit`,
      onPress: editAction?.click
    },
    {
      icon: StarOutlined,
      label: favoriteAction?.name ?? t`Add to Favorites`,
      onPress: favoriteAction?.click
    },
    ...(onSelectItem
      ? [{ icon: Check, label: t`Select Item`, onPress: handleSelectItem }]
      : []),
    {
      icon: Share,
      label: t`Share Item`,
      onPress: () => {}
    },
    {
      icon: DriveFileMoveOutlined,
      label: t`Move to Another Folder`,
      onPress: moveAction?.click
    },
    {
      icon: ContentCopy,
      label: t`Duplicate`,
      onPress: () => {}
    },
    {
      icon: TrashOutlined,
      label: t`Delete Item`,
      onPress: deleteAction?.click,
      isDestructive: true
    }
  ]

  return (
    <ContentContainer scrollable contentStyle={{ padding: 0 }}>
      {actionItems.map(({ icon: Icon, label, onPress, isDestructive }) => (
        <NavbarListItem
          key={label}
          icon={
            <Icon
              color={
                isDestructive
                  ? theme.colors.colorSurfaceDestructiveElevated
                  : theme.colors.colorTextPrimary
              }
            />
          }
          label={label}
          variant={isDestructive ? 'destructive' : 'default'}
          platform="mobile"
          showDivider
          onClick={onPress}
        />
      ))}
    </ContentContainer>
  )
}
