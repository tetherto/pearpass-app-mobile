import { useMemo } from 'react'

import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'

import { MenuActionItem } from '../../components/MenuActionItem'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { BottomSheetSortContent } from '../BottomSheetSortContent'

export const BottomSheetToolbarActionsContent = ({ setIsMultiSelectOn }) => {
  const { collapse, expand } = useBottomSheet()
  const { t } = useLingui()

  const recordListActions = useMemo(
    () => [
      {
        name: t`Multiple selections`,
        type: 'selection',
        click: () => {
          setIsMultiSelectOn(true)
          collapse?.()
        }
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

  return (
    <BottomSheetFlatList
      style={{ padding: 20 }}
      data={recordListActions}
      renderItem={({ item }) => (
        <MenuActionItem
          key={item.name}
          item={item}
          onPress={item.click}
          disableHaptics
        />
      )}
    />
  )
}
