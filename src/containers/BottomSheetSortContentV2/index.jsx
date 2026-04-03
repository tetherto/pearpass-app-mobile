import { useContext } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  Button,
  NavbarListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { ContentContainer } from '../ContentContainer'

export const BottomSheetSortContentV2 = () => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse } = useBottomSheet()
  const { state, setState } = useSharedFilter()
  const styles = createStyles()
  const insets = useContext(SafeAreaInsetsContext)
  const bottom = insets?.bottom ?? 0

  const sortOptions = [
    { key: 'Title A-Z', label: t`Title (A-Z)` },
    { key: 'Last Updated Newest', label: t`Last Updated (Newest first)` },
    { key: 'Last Updated Oldest', label: t`Last Updated (Oldest first)` },
    { key: 'Date Added Newest', label: t`Date Added (Newest first)` },
    { key: 'Date Added Oldest', label: t`Date Added (Oldest first)` }
  ]

  const activeSort = state.sort

  const handleSelect = (key) => {
    setState((prev) => ({ ...prev, sort: key }))
    collapse()
  }

  const handleColor = theme.colors.colorSurfaceElevatedOnInteraction

  return (
    <ContentContainer
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={
        <>
          <View style={styles.dragHandleArea}>
            <View
              style={[styles.dragHandle, { backgroundColor: handleColor }]}
            />
          </View>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text variant="bodyEmphasized" style={styles.headerTitle}>
              {t`Order Items`}
            </Text>
            <Button
              variant="tertiary"
              size="medium"
              iconBefore={<Close color={theme.colors.colorTextPrimary} />}
              onClick={collapse}
              aria-label={t`Close`}
            />
          </View>
        </>
      }
    >
      {sortOptions.map((option) => (
        <NavbarListItem
          key={option.key}
          label={option.label}
          selected={activeSort === option.key}
          platform="mobile"
          showDivider
          onClick={() => handleSelect(option.key)}
        />
      ))}
    </ContentContainer>
  )
}
