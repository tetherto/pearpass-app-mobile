import { useCallback, useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { RECORD_TYPES, useRecords } from '@tetherto/pearpass-lib-vault'

import { useCopyToClipboard } from './useCopyToClipboard'
import { BottomSheetSortContent } from '../containers/BottomSheetSortContent'
import { useBottomSheet } from '../context/BottomSheetContext'
import { useSharedFilter } from '../context/SharedFilterContext'

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
  onDelete
} = {}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { collapse, expand } = useBottomSheet()
  const { copyToClipboard } = useCopyToClipboard()
  const { updateFavoriteState } = useRecords()
  const { setState } = useSharedFilter()

  const handleDelete = useCallback(() => {
    collapse?.()
    navigation.navigate('MultiSelectDelete', {
      selectedRecordIds: [record?.id],
      selectedRecordObjects: [record],
      onComplete: onDelete
    })
  }, [record, onDelete])

  const handleFavoriteToggle = useCallback(() => {
    updateFavoriteState([record?.id], !record?.isFavorite)
    collapse?.()
  }, [record])

  const handleEdit = useCallback(() => {
    navigation.navigate('CreateRecord', {
      record: record,
      recordType: record.type,
      selectedFolder: record.folder
    })
    collapse?.()
  }, [record])

  const handleMoveClick = useCallback(() => {
    collapse?.()
    navigation.navigate('MultiSelectMove', {
      selectedRecordIds: [record?.id],
      selectedRecordObjects: [record]
    })
  }, [record])

  const handleCopy = useCallback((value) => {
    if (!value?.length) {
      return
    }

    copyToClipboard(value)
    collapse?.()
  }, [])

  const handleSort = useCallback((sortOrder) => {
    setState((prev) => ({ ...prev, sort: sortOrder }))
    collapse?.()
  }, [])

  const actionsByType = useMemo(
    () => ({
      [RECORD_TYPES.CREDIT_CARD]: [
        {
          name: t`Copy Name on card`,
          type: 'copy',
          click: () => handleCopy(record?.data?.name)
        },
        {
          name: t`Copy Number on card`,
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
        name: t`Recent`,
        type: 'recent',
        click: () => {
          handleSort('Recent')
        }
      },
      {
        name: t`Newest to oldest`,
        type: 'sort',
        click: () => {
          handleSort('Newest to oldest')
        }
      },
      {
        name: t`Oldest to newest`,
        type: 'sort',
        click: () => {
          handleSort('Oldest to newest')
        }
      }
    ],
    []
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
