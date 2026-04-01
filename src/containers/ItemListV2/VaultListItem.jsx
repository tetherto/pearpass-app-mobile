import { Button, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Check,
  ErrorFilled,
  KeyboardArrowRightFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'

import { createStyles } from './VaultListItem.styles'
import { RecordItemRow } from '../../components/RecordItemRow'

export const VaultListItem = ({
  record,
  isMultiSelectOn,
  isSelected,
  onPress,
  onLongPress
}) => {
  const { theme } = useTheme()
  const styles = createStyles(theme.colors)

  return (
    <Button
      variant="tertiary"
      onClick={() => onPress(record.id)}
      onLongPress={() => onLongPress?.(record)}
      delayLongPress={300}
      accessible={false}
      style={styles.container}
      aria-label={record.title}
    >
      {isMultiSelectOn && (
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
            {isSelected && <Check width={14} height={14} />}
          </View>
        </View>
      )}

      <RecordItemRow record={record} />

      {!isMultiSelectOn && (
        <View style={styles.rightContainer}>
          {record.hasSecurityAlert && <ErrorFilled width={20} height={20} />}
          <View style={styles.chevron}>
            <KeyboardArrowRightFilled
              width={18}
              height={18}
              color={theme.colors.colorTextSecondary}
            />
          </View>
        </View>
      )}
    </Button>
  )
}
