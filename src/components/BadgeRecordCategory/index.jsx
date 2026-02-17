import { useLingui } from '@lingui/react/macro'
import { colors } from 'pearpass-lib-ui-theme-provider/native'

import { CategoryItem, CategoryText } from './styles'
import { RECORD_COLOR_BY_TYPE } from '../../constants/recordColorByType'
import { RECORD_ICON_BY_TYPE } from '../../constants/recordIconByType'

const CATEGORY_TEST_IDS = {
  all: 'home-category-all-button',
  login: 'home-category-logins-button',
  creditCard: 'home-category-credit-cards-button',
  wifiPassword: 'home-category-wifi-button',
  passPhrase: 'home-category-recovery-phrase-button',
  identity: 'home-category-identities-button',
  note: 'home-category-notes-button',
  custom: 'home-category-custom-button'
}

const CATEGORY_ACCESSIBILITY_LABELS = {
  all: 'All items category button',
  login: 'Logins category button',
  creditCard: 'Credit cards category button',
  wifiPassword: 'Wi-Fi category button',
  passPhrase: 'Recovery phrase category button',
  identity: 'Identities category button',
  note: 'Notes category button',
  custom: 'Custom category button'
}

const CATEGORY_ICON_ACCESSIBILITY_LABELS = {
  all: 'All items category icon',
  login: 'Logins category icon',
  creditCard: 'Credit cards category icon',
  wifiPassword: 'Wi-Fi category icon',
  passPhrase: 'Recovery phrase category icon',
  identity: 'Identities category icon',
  note: 'Notes category icon',
  custom: 'Custom category icon'
}

const CATEGORY_TEXT_TEST_IDS = {
  all: 'home-category-all-button-text',
  login: 'home-category-logins-button-text',
  creditCard: 'home-category-credit-cards-button-text',
  wifiPassword: 'home-category-wifi-button-text',
  passPhrase: 'home-category-recovery-phrase-button-text',
  identity: 'homeCategoryIdentitiesButtonText',
  note: 'home-category-notes-button-text',
  custom: 'home-category-custom-button-text'
}

const CATEGORY_TEXT_ACCESSIBILITY_LABELS = {
  all: 'All items category count',
  login: 'Logins category count',
  creditCard: 'Credit cards category count',
  wifiPassword: 'Wi-Fi category count',
  passPhrase: 'Recovery phrase category count',
  identity: 'Identities category count',
  note: 'Notes category count',
  custom: 'Custom category count'
}

export const BadgeRecordCategory = ({ item, isActive, onPress, quantity }) => {
  const { t } = useLingui()
  const Icon = RECORD_ICON_BY_TYPE[item.type]

  const baseTestId = CATEGORY_TEST_IDS[item.type]

  return (
    <CategoryItem
      activeOpacity={0.5}
      color={isActive ? RECORD_COLOR_BY_TYPE[item.type] : undefined}
      borderColor={RECORD_COLOR_BY_TYPE[item.type]}
      onPress={onPress}
      testID={baseTestId}
      accessibilityLabel={t(CATEGORY_ACCESSIBILITY_LABELS[item.type])}
    >
      <Icon
        color={isActive ? colors.black.mode1 : RECORD_COLOR_BY_TYPE[item.type]}
        size={21}
        fill
        testID={`${baseTestId}-icon`}
        accessibilityLabel={t(CATEGORY_ICON_ACCESSIBILITY_LABELS[item.type])}
      />
      <CategoryText
        active={isActive}
        testID={CATEGORY_TEXT_TEST_IDS[item.type]}
        accessibilityLabel={t(CATEGORY_TEXT_ACCESSIBILITY_LABELS[item.type])}
      >
        {item.name} {quantity}
      </CategoryText>
    </CategoryItem>
  )
}
