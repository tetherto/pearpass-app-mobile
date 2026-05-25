import { Check, MoreVert } from '@tetherto/pearpass-lib-ui-kit/icons'

import {
  MenuItemWrapper,
  MenuItemContainer,
  ItemContainer,
  RecordText,
  MenuItemRightSide
} from './styles'
import { RECORD_ACTION_ICON_BY_TYPE } from '../../constants/recordActions'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

export const MenuActionItem = ({ item, onPress, disableHaptics = false }) => {
  const { state } = useSharedFilter()
  const { hapticButtonSecondary } = useHapticFeedback()
  const ActionIcon = RECORD_ACTION_ICON_BY_TYPE[item.type]

  const handlePress = () => {
    if (!disableHaptics) {
      hapticButtonSecondary()
    }
    onPress?.()
  }

  return (
    <MenuItemWrapper>
      <MenuItemContainer onPress={handlePress}>
        <ItemContainer>
          <ActionIcon width="24" height="24" />
          <RecordText>{item.name}</RecordText>
        </ItemContainer>
        <MenuItemRightSide>
          {(item.type === 'sort' || item.type === 'recent') &&
            item.name === state.sort && <Check width={24} height={24} />}

          <MoreVert width={24} height={24} />
        </MenuItemRightSide>
      </MenuItemContainer>
    </MenuItemWrapper>
  )
}
