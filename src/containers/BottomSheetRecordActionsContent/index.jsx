import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

import { MenuActionItem } from '../../components/MenuActionItem'
import { useRecordActionItems } from '../../hooks/useRecordActionItems'

/**
 * @param {{
 *  recordType: string,
 *  record: {[key: string]: any}
 *  onDelete: () => void
 *  excludeTypes: Array<string>
 * }} props
 */
export const BottomSheetRecordActionsContent = ({
  recordType,
  record,
  excludeTypes,
  onDelete
}) => {
  const { actions } = useRecordActionItems({
    excludeTypes,
    record,
    recordType,
    onDelete
  })

  return (
    <BottomSheetFlatList
      style={{ padding: 20 }}
      data={actions}
      renderItem={({ item }) => (
        <MenuActionItem key={item.name} item={item} onPress={item.click} />
      )}
    />
  )
}
