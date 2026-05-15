import { useCallback, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useBottomSheetClose } from '@tetherto/pearpass-lib-ui-kit'
import { RECORD_TYPES, useRecords } from '@tetherto/pearpass-lib-vault'

import { useCopyToClipboard } from './useCopyToClipboard'
import { SORT_KEYS } from '../constants/sortOptions'
import { BottomSheetFolderListContent } from '../containers/BottomSheetFolderListContent'
import { BottomSheetSortContent } from '../containers/BottomSheetSortContent'
import { ConfirmModalContent } from '../containers/Modal/ConfirmModalContent'
import { useBottomSheet } from '../context/BottomSheetContext'
import { useModal } from '../context/ModalContext'
import { useSharedFilter } from '../context/SharedFilterContext'
import { isV2 } from '../utils/designVersion'

/**
 * @param {{
 *  excludeTypes: Array<string>
 *  recordType: string,
 *  onDelete: () => void
 *  record: {[key: string]: any}
 * }} props
 * @returns {{
 *   actions: {
 *    name: string,
 *    type: string,
 *    click: () => void
 *  }
 *   recordListActions: {
 *    name: string,
 *    type: string,
 *    click: () => void
 *  }
 * }[]}
 */
export const useRecordActionItems = ({
  excludeTypes = [],
  recordType,
  record,
  onDelete,
  isOtpContext: isOtpContextProp = false
} = {}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { openModal, closeModal } = useModal()
  const v2Collapse = useBottomSheetClose()
  const { collapse: v1Collapse, expand } = useBottomSheet()

  // Combined collapse for shared handlers (copy, favorite, edit, sort)
  const collapse = useCallback(() => {
    v1Collapse?.()
    v2Collapse?.()
  }, [v1Collapse, v2Collapse])

  const { copyToClipboard } = useCopyToClipboard()
  const { deleteRecords, updateFavoriteState, updateFolder } = useRecords({
    onCompleted: () => {
      if (!isV2()) {
        closeModal()
        v1Collapse?.()
        onDelete?.()
      }
    }
  })
  const { setState } = useSharedFilter()

  // RECORD_TYPES.OTP is `undefined` (used as a route-state sentinel for the
  // Authenticator screen). Comparing the unset `recordType` parameter against
  // it would always be true — so only rely on the explicit `isOtpContextProp`
  // flag, which callers set when they actually mean "Authenticator context".
  const isOtpContext = isOtpContextProp
  const isAuthenticatorLoginRecord =
    isOtpContext && record?.type === RECORD_TYPES.LOGIN

  const handleDelete = useCallback(() => {
    if (isV2()) {
      collapse?.()
      navigation.navigate('MultiSelectDelete', {
        selectedRecordIds: [record?.id],
        selectedRecordObjects: [record],
        onComplete: onDelete,
        isOtpContext: false
      })
    } else {
      v1Collapse?.()
      openModal(
        <ConfirmModalContent
          title="Delete item"
          text="Are you sure that you want to delete this item?"
          secondaryAction={closeModal}
          primaryAction={async () => {
            await deleteRecords([record?.id])
          }}
        />
      )
    }
  }, [
    record,
    recordType,
    isOtpContextProp,
    onDelete,
    collapse,
    v1Collapse,
    navigation,
    openModal,
    closeModal,
    deleteRecords
  ])

  const handleFavoriteToggle = useCallback(() => {
    updateFavoriteState([record?.id], !record?.isFavorite)
    collapse?.()
  }, [record, collapse, updateFavoriteState])

  const handleEdit = useCallback(() => {
    navigation.navigate('CreateRecord', {
      record: record,
      recordType: isAuthenticatorLoginRecord ? RECORD_TYPES.OTP : record.type,
      selectedFolder: record.folder
    })
    collapse?.()
  }, [record, recordType, isOtpContextProp, navigation, collapse])

  const handleFolderMoveSelect = useCallback(
    async (folder) => {
      await updateFolder([record?.id], folder.name)
    },
    [record, updateFolder]
  )

  const handleMoveClick = useCallback(() => {
    if (isV2()) {
      collapse?.()
      navigation.navigate('MultiSelectMove', {
        selectedRecordIds: [record?.id],
        selectedRecordObjects: [record]
      })
    } else {
      collapse?.()
      expand({
        children: (
          <BottomSheetFolderListContent
            onFolderSelect={handleFolderMoveSelect}
          />
        ),
        snapPoints: ['10%', '25%', '25%']
      })
    }
  }, [record, navigation, collapse, expand, handleFolderMoveSelect])

  const handleCopy = useCallback(
    (value) => {
      if (!value?.length) {
        return
      }

      copyToClipboard(value)
      collapse?.()
    },
    [copyToClipboard, collapse]
  )

  const handleSort = useCallback(
    (sortOrder) => {
      setState((prev) => ({ ...prev, sort: sortOrder }))
      collapse?.()
    },
    [setState, collapse]
  )

  const actionsByType = useMemo(
    () => ({
      [RECORD_TYPES.CREDIT_CARD]: [
        {
          name: t`Copy Cardholder Name`,
          type: 'copy',
          click: () => handleCopy(record?.data?.name)
        },
        {
          name: t`Copy Card Number`,
          type: 'copy',
          click: () => handleCopy(record?.data?.number)
        }
      ],
      [RECORD_TYPES.IDENTITY]: [
        {
          name: t`Copy Full name`,
          type: 'copy',
          click: () => handleCopy(record?.data?.fullName)
        },
        {
          name: t`Copy Email address`,
          type: 'copy',
          click: () => handleCopy(record?.data?.email)
        }
      ],
      [RECORD_TYPES.LOGIN]: [
        {
          name: t`Copy Email or username`,
          type: 'copy',
          click: () => handleCopy(record?.data?.username)
        },
        {
          name: t`Copy Password`,
          type: 'copy',
          click: () => handleCopy(record?.data?.password)
        }
      ],
      [RECORD_TYPES.NOTE]: [
        {
          name: t`Copy Note`,
          type: 'copy',
          click: () => handleCopy(record?.data?.note)
        }
      ],
      [RECORD_TYPES.CUSTOM]: [],
      [RECORD_TYPES.WIFI_PASSWORD]: [
        {
          name: t`Copy Wi-Fi Password`,
          type: 'copy',
          click: () => handleCopy(record?.data?.password)
        }
      ],
      [RECORD_TYPES.PASS_PHRASE]: [
        {
          name: t`Copy PassPhrase`,
          type: 'copy',
          click: () => handleCopy(record?.data?.passPhrase)
        }
      ]
    }),
    [record]
  )

  const defaultActions = useMemo(
    () => [
      {
        name: t`Move to another folder`,
        type: 'move',
        click: handleMoveClick
      },
      {
        name: record?.isFavorite
          ? t`Remove from Favorites`
          : t`Add to Favorites`,
        type: 'favorite',
        click: handleFavoriteToggle
      },
      {
        name: t`Edit`,
        type: 'edit',
        click: handleEdit
      },
      { name: t`Delete element`, type: 'delete', click: handleDelete }
    ],
    [excludeTypes, record]
  )

  const recordListActions = useMemo(
    () => [
      {
        name: t`Multiple selections`,
        type: 'selection',
        click: () => {}
      },
      {
        name: t`Order`,
        type: 'order',
        click: () => {
          collapse?.()
          expand({
            children: <BottomSheetSortContent />,
            snapPoints: ['10%', '25%', '25%']
          })
        }
      }
    ],
    []
  )

  const recordSortActions = useMemo(
    () => [
      {
        name: t`Last Updated (Newest first)`,
        type: 'sort',
        click: () => handleSort(SORT_KEYS.LAST_UPDATED_NEWEST)
      },
      {
        name: t`Last Updated (Oldest first)`,
        type: 'sort',
        click: () => handleSort(SORT_KEYS.LAST_UPDATED_OLDEST)
      },
      {
        name: t`Title (A-Z)`,
        type: 'sort',
        click: () => handleSort(SORT_KEYS.TITLE_AZ)
      }
    ],
    [handleSort, t]
  )

  const filteredActions = useMemo(
    () =>
      !!recordType
        ? [...actionsByType[recordType], ...defaultActions].filter(
            (action) => !excludeTypes.includes(action.type)
          )
        : defaultActions,
    [recordType, excludeTypes]
  )

  return { actions: filteredActions, recordListActions, recordSortActions }
}
