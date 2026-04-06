import { useLingui } from '@lingui/react/macro'
import { NavbarListItem, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useRecordMenuItems } from '../../hooks/useRecordMenuItems'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { Layout } from '../Layout'

export const BottomSheetCategorySelectorContent = ({
  recordType,
  onSelect
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { collapse } = useBottomSheet()
  const { state } = useSharedFilter()
  const { bottom } = useSafeAreaInsets()

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
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Categories`} onClose={collapse} />}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon

        return (
          <NavbarListItem
            key={item.type}
            label={item.name}
            count={recordCountsByType?.[item.type]}
            selected={recordType === item.type}
            platform="mobile"
            showDivider={index < menuItems.length - 1}
            onClick={() => handleSelect(item.type)}
            icon={
              Icon ? <Icon color={theme.colors.colorTextPrimary} /> : undefined
            }
            iconSize={16}
          />
        )
      })}
    </Layout>
  )
}
