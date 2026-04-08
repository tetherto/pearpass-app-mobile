import { useLingui } from '@lingui/react/macro'
import {
  NavbarListItem,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { CalendarToday, SortByAlpha } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SORT_KEYS } from '../../constants/sortOptions'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { Layout } from '../Layout'

export const BottomSheetSortContentV2 = () => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { state, setState } = useSharedFilter()
  const { bottom } = useSafeAreaInsets()

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

  return (
    <Layout
      mode="sheet"
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Item Order`} onClose={collapse} />}
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
