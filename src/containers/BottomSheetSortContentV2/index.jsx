import { useLingui } from '@lingui/react/macro'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Check, Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { Pressable, View } from 'react-native'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { ContentContainer } from '../ContentContainer'

export const BottomSheetSortContentV2 = () => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse } = useBottomSheet()
  const { state, setState } = useSharedFilter()
  const styles = createStyles(theme.colors)

  const sortOptions = [
    { key: 'Title A-Z', label: t`Title (A-Z)` },
    { key: 'Last Used Newest', label: t`Last Used (Newest)` },
    { key: 'Last Used Oldest', label: t`Last Used (Oldest)` },
    { key: 'Date Added Newest', label: t`Date Added (Newest)` },
    { key: 'Date Added Oldest', label: t`Date Added (Oldest)` }
  ]

  // 'Recent' is the legacy key — treat it as equivalent to 'Last Used Newest'
  const activeSort = state.sort === 'Recent' ? 'Last Used Newest' : state.sort

  const handleSelect = (key) => {
    setState((prev) => ({ ...prev, sort: key }))
    collapse()
  }

  return (
    <ContentContainer contentStyle={{ padding: 0 }}>
      <View style={styles.header}>
        <Text variant="bodyEmphasized">{t`Order Items`}</Text>
        <Button
          variant="tertiary"
          iconBefore={<Close color={theme.colors.colorTextPrimary} />}
          onClick={collapse}
          aria-label={t`Close`}
        />
      </View>
      {sortOptions.map((option) => {
        const isActive = activeSort === option.key
        return (
          <Pressable
            key={option.key}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => handleSelect(option.key)}
          >
            <Text variant="label">{option.label}</Text>
            {isActive && (
              <Check
                width={16}
                height={16}
                color={theme.colors.colorTextPrimary}
              />
            )}
          </Pressable>
        )
      })}
    </ContentContainer>
  )
}
