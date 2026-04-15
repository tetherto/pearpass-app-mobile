import { formatDate } from '@tetherto/pear-apps-utils-date'
import {
  BrushIcon,
  CheckIcon,
  DeleteIcon,
  LockCircleIcon,
  ShareIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { ActivityIndicator } from 'react-native'

import {
  SelectedListItemIconContainer,
  ListItemActions,
  ListItemContainer,
  ListItemDate,
  ListItemDescription,
  ListItemInfo,
  ListItemName
} from './styles'

/**
 * @param {{
 *  name: string
 *  date: string
 *  onShareClick: () => void
 *  onEditClick: () => void
 *  onDeleteClick: () => void
 *  onPress: () => void
 *  isSelected?: boolean
 *  isLoading?: boolean
 *  testID?: string
 *  accessibilityLabel?: string
 *  nameTestID?: string
 *  nameAccessibilityLabel?: string
 *  dateTestID?: string
 *  dateAccessibilityLabel?: string
 * }} props
 */
export const ListItem = ({
  name,
  date,
  onShareClick,
  onEditClick,
  onDeleteClick,
  onPress,
  isSelected = false,
  isLoading = false,
  testID,
  accessibilityLabel,
  nameTestID,
  nameAccessibilityLabel,
  dateTestID,
  dateAccessibilityLabel,
  ...restProps
}) => (
  <ListItemContainer
    isSelected={isSelected}
    onPress={onPress}
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    {...restProps}
  >
    <ListItemInfo>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary400.mode1} />
      ) : isSelected ? (
        <SelectedListItemIconContainer>
          <CheckIcon color={colors.black.mode1} size="21" />
        </SelectedListItemIconContainer>
      ) : (
        <LockCircleIcon size="21" />
      )}

      <ListItemDescription>
        <ListItemName
          testID={nameTestID}
          accessibilityLabel={nameAccessibilityLabel}
        >
          {name}
        </ListItemName>
        {!!date && (
          <ListItemDate
            testID={dateTestID}
            accessibilityLabel={dateAccessibilityLabel}
          >
            {formatDate(date, 'dd-mm-yyyy', '/')}
          </ListItemDate>
        )}
      </ListItemDescription>
    </ListItemInfo>
    <ListItemActions>
      {onShareClick && <ShareIcon onPress={onShareClick} />}
      {onEditClick && <BrushIcon onPress={onEditClick} />}
      {onDeleteClick && <DeleteIcon onPress={onDeleteClick} />}
    </ListItemActions>
  </ListItemContainer>
)
