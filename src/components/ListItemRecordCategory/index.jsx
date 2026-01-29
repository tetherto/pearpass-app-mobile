import {
  ItemCategoryWrapper,
  CategoryContainer,
  CategoryContent,
  CategoryIConContainer,
  CategoryDescription,
  CategoryName
} from './styles'
import { RECORD_COLOR_BY_TYPE } from '../../constants/recordColorByType'
import { RECORD_ICON_BY_TYPE } from '../../constants/recordIconByType'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

/**
 *
 * @param {{
 *   item: {
 *    type: string,
 *    name: string,
 *    description: string
 *   },
 *   onPress: () => void
 * }} props
 */
export const ListItemRecordCategory = ({ item, onPress }) => {
  const Icon = RECORD_ICON_BY_TYPE[item.type]
  const { hapticButtonSecondary } = useHapticFeedback()

  const handlePress = () => {
    hapticButtonSecondary()
    onPress?.()
  }

  return (
    <ItemCategoryWrapper>
      <CategoryContainer
        onPress={handlePress}
        testID={`record-item-${item.type}`}
        accessible
      >
        <CategoryIConContainer color={RECORD_COLOR_BY_TYPE[item.type]}>
          <Icon size={24} color={RECORD_COLOR_BY_TYPE[item.type]} fill />
        </CategoryIConContainer>

        <CategoryContent>
          <CategoryName>{item.name}</CategoryName>

          <CategoryDescription>{item.description}</CategoryDescription>
        </CategoryContent>
      </CategoryContainer>
    </ItemCategoryWrapper>
  )
}
