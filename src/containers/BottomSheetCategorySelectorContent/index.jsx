import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { AUTHENTICATOR_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  NavbarListItem,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { TwoFactorAuthenticationOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import {
  RECORD_TYPES,
  useRecordCountsByType
} from '@tetherto/pearpass-lib-vault'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSharedFilter } from '../../context/SharedFilterContext'
import { useRecordMenuItems } from '../../hooks/useRecordMenuItems'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { Layout } from '../Layout'

/**
 * @typedef {Object} BottomSheetCategorySelectorContentProps
 * @property {string} [recordType]
 * @property {(type: string) => void} [onSelect]
 * @property {string[]} [exclude]
 * @property {string} [title]
 * @property {'filter' | 'add-item'} [variant]
 */

/**
 * @param {BottomSheetCategorySelectorContentProps} [props]
 */
export const BottomSheetCategorySelectorContent = (props = {}) => {
  const { recordType, onSelect, exclude, title, variant = 'filter' } = props

  const { t } = useLingui()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { state } = useSharedFilter()
  const { bottom } = useSafeAreaInsets()
  const isAddItemVariant = variant === 'add-item'

  const menuItems = useRecordMenuItems({
    exclude: exclude ?? (isAddItemVariant ? ['all'] : ['password'])
  })

  const selectorItems = useMemo(() => {
    if (!isAddItemVariant) return menuItems

    return [
      ...menuItems.map((item) =>
        item.type === RECORD_TYPES.CREDIT_CARD
          ? { ...item, name: t`Credit Card` }
          : item
      ),
      ...(AUTHENTICATOR_ENABLED
        ? [
            {
              name: t`Authenticator Code`,
              type: 'authenticator',
              icon: TwoFactorAuthenticationOutlined
            }
          ]
        : [])
    ]
  }, [isAddItemVariant, menuItems, t])

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
      header={
        <SheetHeader
          title={title ?? (isAddItemVariant ? t`Add Item` : t`Categories`)}
          onClose={collapse}
        />
      }
    >
      {selectorItems.map((item, index) => {
        const Icon = item.icon

        return (
          <NavbarListItem
            key={item.type}
            label={item.name}
            count={
              isAddItemVariant ? undefined : recordCountsByType?.[item.type]
            }
            selected={!isAddItemVariant && recordType === item.type}
            platform="mobile"
            showDivider={index < selectorItems.length - 1}
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
