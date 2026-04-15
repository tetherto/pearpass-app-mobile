import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'

import { BottomSheetCategorySelectorContent } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@tetherto/pearpass-lib-constants', () => ({
  AUTHENTICATOR_ENABLED: true
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  RECORD_TYPES: {
    LOGIN: 'LOGIN',
    CREDIT_CARD: 'CREDIT_CARD',
    IDENTITY: 'IDENTITY',
    NOTE: 'NOTE',
    PASS_PHRASE: 'PASS_PHRASE',
    WIFI_PASSWORD: 'WIFI_PASSWORD',
    CUSTOM: 'CUSTOM'
  },
  useRecordCountsByType: jest.fn(() => ({
    data: {
      LOGIN: 1,
      CREDIT_CARD: 2,
      IDENTITY: 3,
      NOTE: 4,
      PASS_PHRASE: 5,
      WIFI_PASSWORD: 6,
      CUSTOM: 7
    }
  }))
}))

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => ({
  TwoFactorAuthenticationOutlined: () => null
}))

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const { Text, TouchableOpacity, View } = require('react-native')

  return {
    NavbarListItem: ({ label, count, selected, onClick, showDivider }) => (
      <TouchableOpacity onPress={onClick} testID={`item-${label}`}>
        <Text>{label}</Text>
        {count !== undefined && <Text testID={`count-${label}`}>{count}</Text>}
        <Text testID={`selected-${label}`}>{String(selected)}</Text>
        <View
          testID={`divider-${label}`}
          accessibilityState={{ selected: showDivider }}
        />
      </TouchableOpacity>
    ),
    useBottomSheetClose: () => jest.fn(),
    useTheme: () => ({
      theme: {
        colors: {
          colorTextPrimary: '#fff'
        }
      }
    })
  }
})

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0 })
}))

jest.mock('../../context/SharedFilterContext', () => ({
  useSharedFilter: () => ({
    state: {
      folder: 'allFolder',
      isFavorite: false
    }
  })
}))

jest.mock('../../hooks/useRecordMenuItems', () => ({
  useRecordMenuItems: jest.fn(({ exclude = [] } = {}) => {
    const items = [
      { name: 'All Items', type: 'all', icon: () => null },
      { name: 'Logins', type: 'LOGIN', icon: () => null },
      { name: 'Credit Cards', type: 'CREDIT_CARD', icon: () => null },
      { name: 'Identities', type: 'IDENTITY', icon: () => null },
      { name: 'Notes', type: 'NOTE', icon: () => null },
      { name: 'Recovery Phrases', type: 'PASS_PHRASE', icon: () => null },
      { name: 'Wi-Fi', type: 'WIFI_PASSWORD', icon: () => null },
      { name: 'Other', type: 'CUSTOM', icon: () => null },
      { name: 'Password', type: 'password', icon: () => null }
    ]

    return items.filter((item) => !exclude.includes(item.type))
  })
}))

jest.mock('../BottomSheet/SheetHeader', () => ({
  SheetHeader: ({ title }) => title
}))

jest.mock('../Layout', () => {
  const { View } = require('react-native')

  return {
    Layout: ({ header, children }) => (
      <>
        <View testID="header">{header}</View>
        {children}
      </>
    )
  }
})

const renderWithProviders = (ui) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

describe('BottomSheetCategorySelectorContent', () => {
  it('renders filter variant with counts and categories title', () => {
    const { getByTestId, queryByText, queryByTestId } = renderWithProviders(
      <BottomSheetCategorySelectorContent recordType="LOGIN" />
    )

    expect(getByTestId('header').props.children.props.title).toBe('Categories')
    expect(getByTestId('item-Logins')).toBeTruthy()
    expect(getByTestId('count-Logins')).toBeTruthy()
    expect(getByTestId('selected-Logins').props.children).toBe('true')
    expect(queryByText('Password')).toBeNull()
    expect(queryByText('Authenticator Code')).toBeNull()
    expect(queryByTestId('count-Credit Cards')).toBeTruthy()
  })

  it('renders add-item variant without counts and with add-only rows', () => {
    const { getByTestId, queryByTestId } = renderWithProviders(
      <BottomSheetCategorySelectorContent variant="add-item" />
    )

    expect(getByTestId('header').props.children.props.title).toBe('Add Item')
    expect(getByTestId('item-Credit Card')).toBeTruthy()
    expect(getByTestId('item-Password')).toBeTruthy()
    expect(getByTestId('item-Authenticator Code')).toBeTruthy()
    expect(queryByTestId('count-Logins')).toBeNull()
    expect(queryByTestId('count-Credit Card')).toBeNull()
  })
})
