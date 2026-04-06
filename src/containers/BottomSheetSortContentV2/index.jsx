import { useContext } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  Button,
  NavbarListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  CalendarToday,
  Close,
  SortByAlpha
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

import { createStyles } from './styles'
import { SORT_KEYS } from '../../constants/sortOptions'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { Layout } from '../Layout'

export const BottomSheetSortContentV2 = () => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse } = useBottomSheet()
  const { state, setState } = useSharedFilter()
  const styles = createStyles()
  const insets = useContext(SafeAreaInsetsContext)
  const bottom = insets?.bottom ?? 0

  const sortOptions = [
    { key: SORT_KEYS.TITLE_AZ, label: t`Title (A-Z)`, icon: SortByAlpha },
    {
      key: SORT_KEYS.LAST_UPDATED_NEWEST,
      label: t`Last Updated (Newest first)`,
      icon: CalendarToday
    },
    {
      key: SORT_KEYS.LAST_UPDATED_OLDEST,
      label: t`Last Updated (Oldest first)`,
      icon: CalendarToday
    },
    {
      key: SORT_KEYS.DATE_ADDED_NEWEST,
      label: t`Date Added (Newest first)`,
      icon: CalendarToday
    },
    {
      key: SORT_KEYS.DATE_ADDED_OLDEST,
      label: t`Date Added (Oldest first)`,
      icon: CalendarToday
    }
  ]

  const activeSort = state.sort

  const handleSelect = (key) => {
    setState((prev) => ({ ...prev, sort: key }))
    collapse()
  }

  const handleColor = theme.colors.colorSurfaceElevatedOnInteraction

  return (
    <Layout
      mode="sheet"
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
              {t`Item Order`}
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
      {sortOptions.map(({ key, label, icon: Icon }, index) => (
        <NavbarListItem
          key={key}
          icon={<Icon color={theme.colors.colorTextPrimary} />}
          iconSize={16}
          label={label}
          selected={activeSort === key}
          platform="mobile"
          showDivider={index < sortOptions.length - 1}
          onClick={() => handleSelect(key)}
        />
      ))}
    </Layout>
  )
}
