import { useMemo } from 'react'

import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { DESIGN_VERSION } from '@tetherto/pearpass-lib-constants'

import { MenuActionItem } from '../../components/MenuActionItem'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useRecordActionItems } from '../../hooks/useRecordActionItems'

/**
 * @param {{
 *  recordType: string,
 *  record: {[key: string]: any}
 *  onDelete: () => void
 *  excludeTypes: Array<string>
 *  onSelectItem: () => void
 * }} props
 */
export const BottomSheetRecordActionsContent = ({
  recordType,
  record,
  excludeTypes,
  onDelete,
  onSelectItem
}) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()
  const { actions } = useRecordActionItems({
    excludeTypes,
    record,
    recordType,
    onDelete
  })

  const v2Actions = useMemo(() => {
    if (DESIGN_VERSION !== 2 || !onSelectItem) return actions

    const selectAction = {
      name: t`Select Item`,
      type: 'selection',
      click: () => {
        collapse?.()
        onSelectItem()
      }
    }

    const editIndex = actions.findIndex((a) => a.type === 'edit')
    const result = [...actions]
    result.splice(editIndex + 1, 0, selectAction)
    return result
  }, [actions, collapse, onSelectItem, t])

  return (
    <BottomSheetFlatList
      style={{ padding: 20 }}
      data={v2Actions}
      renderItem={({ item }) => (
        <MenuActionItem key={item.name} item={item} onPress={item.click} />
      )}
    />
  )
}
