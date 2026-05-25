import { formatDate } from '@tetherto/pear-apps-utils-date'
import {
  PaletteOutlined,
  Check,
  TrashOutlined,
  LockFilled,
  Share
} from '@tetherto/pearpass-lib-ui-kit/icons'
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
          <Check color={colors.black.mode1} width="21" height="21" />
        </SelectedListItemIconContainer>
      ) : (
        <LockFilled width="21" height="21" />
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
      {onShareClick && <Share onPress={onShareClick} />}
      {onEditClick && <PaletteOutlined onPress={onEditClick} />}
      {onDeleteClick && <TrashOutlined onPress={onDeleteClick} />}
    </ListItemActions>
  </ListItemContainer>
)
