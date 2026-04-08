import { useCallback, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { UNSUPPORTED } from '@tetherto/pearpass-lib-constants'
import {
  NavbarListItem,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  CheckBox,
  CopyAll,
  DriveFileMoveOutlined,
  EditOutlined,
  Share,
  StarOutlined,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useCreateRecord, vaultGetFile } from '@tetherto/pearpass-lib-vault'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRecordActionItems } from '../../hooks/useRecordActionItems'
import { Layout } from '../Layout'

export const BottomSheetRecordActionsContentV2 = ({
  record,
  recordType,
  onDelete,
  onSelectItem
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { bottom } = useSafeAreaInsets()

  const { actions } = useRecordActionItems({ record, recordType, onDelete })
  const { createRecord } = useCreateRecord()

  const editAction = actions.find((a) => a.type === 'edit')
  const favoriteAction = actions.find((a) => a.type === 'favorite')
  const moveAction = actions.find((a) => a.type === 'move')
  const deleteAction = actions.find((a) => a.type === 'delete')

  const handleSelectItem = useCallback(() => {
    collapse()
    onSelectItem?.()
  }, [collapse, onSelectItem])

  const fetchFileBuffers = useCallback(
    (files) =>
      Promise.all(
        (files ?? []).map(async ({ id, name }) => {
          const buffer = await vaultGetFile(`record/${record.id}/file/${id}`)
          return { name, buffer }
        })
      ),
    [record.id]
  )

  const handleDuplicate = useCallback(async () => {
    const attachments = await fetchFileBuffers(record.data?.attachments)
    const data = { ...record.data, attachments }

    if (record.type === 'identity') {
      data.passportPicture = await fetchFileBuffers(
        record.data?.passportPicture
      )
      data.idCardPicture = await fetchFileBuffers(record.data?.idCardPicture)
      data.drivingLicensePicture = await fetchFileBuffers(
        record.data?.drivingLicensePicture
      )
    }

    await createRecord({
      type: record.type,
      folder: record.folder,
      isFavorite: record.isFavorite,
      data
    })
    collapse()
  }, [record, createRecord, collapse, fetchFileBuffers])

  const actionItems = useMemo(
    () => [
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
        ? [{ icon: CheckBox, label: t`Select Item`, onPress: handleSelectItem }]
        : []),
      ...(UNSUPPORTED
        ? []
        : [{ icon: Share, label: t`Share Item`, onPress: () => {} }]),
      {
        icon: DriveFileMoveOutlined,
        label: t`Move to Another Folder`,
        onPress: moveAction?.click
      },
      {
        icon: CopyAll,
        label: t`Duplicate`,
        onPress: handleDuplicate
      },
      {
        icon: TrashOutlined,
        label: t`Delete Item`,
        onPress: deleteAction?.click,
        isDestructive: true
      }
    ],
    [
      editAction,
      favoriteAction,
      moveAction,
      deleteAction,
      onSelectItem,
      handleSelectItem,
      handleDuplicate,
      t
    ]
  )

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
    >
      {actionItems.map(
        ({ icon: Icon, label, onPress, isDestructive }, index) => (
          <NavbarListItem
            key={label}
            iconSize={16}
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
            showDivider={index < actionItems.length - 1}
            onClick={onPress}
          />
        )
      )}
    </Layout>
  )
}
