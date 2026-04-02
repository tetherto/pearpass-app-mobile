import { useLingui } from '@lingui/react/macro'
import {
  Button,
  NavbarListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useRecordMenuItems } from '../../hooks/useRecordMenuItems'
import { ContentContainer } from '../ContentContainer'

export const BottomSheetCategorySelectorContent = ({
  recordType,
  onSelect
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse } = useBottomSheet()
  const { state } = useSharedFilter()
  const styles = createStyles(theme.colors)

  const menuItems = useRecordMenuItems({ exclude: ['password'] })

  const { data: recordCountsByType } = useRecordCountsByType({
    variables: {
      filters: {
        folder:
          state?.folder !== 'allFolder' && state?.folder !== 'favorite'
            ? state?.folder
            : '',
        ...(state?.isFavorite ? { isFavorite: true } : {})
      }
    }
  })

  const handleSelect = (type) => {
    onSelect?.(type)
    collapse()
  }

  return (
    <ContentContainer scrollable contentStyle={{ padding: 0 }}>
      <View style={styles.header}>
        <Text variant="bodyEmphasized">{t`Categories`}</Text>
        <Button
          variant="tertiary"
          iconBefore={<Close color={theme.colors.colorTextPrimary} />}
          onClick={collapse}
          aria-label={t`Close`}
        />
      </View>

      {menuItems.map((item) => (
        <NavbarListItem
          key={item.type}
          label={item.name}
          count={recordCountsByType?.[item.type]}
          selected={recordType === item.type}
          platform="mobile"
          showDivider
          onClick={() => handleSelect(item.type)}
        />
      ))}
    </ContentContainer>
  )
}
