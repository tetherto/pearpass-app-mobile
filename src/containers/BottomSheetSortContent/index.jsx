import { BottomSheetFlatList } from '@gorhom/bottom-sheet'

import { MenuActionItem } from '../../components/MenuActionItem'
import { useRecordActionItems } from '../../hooks/useRecordActionItems'

export const BottomSheetSortContent = () => {
  const { recordSortActions } = useRecordActionItems()

  return (
    <BottomSheetFlatList
      style={{ padding: 20 }}
      data={recordSortActions}
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
