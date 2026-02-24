import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { BadgeRecordCategory } from './index'
import { RECORD_ICON_BY_TYPE } from '../../constants/recordIconByType'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (text) => text
  })
}))

jest.mock('../../constants/recordIconByType', () => ({
  RECORD_ICON_BY_TYPE: {
    login: jest.fn().mockReturnValue(null),
    card: jest.fn().mockReturnValue(null),
    note: jest.fn().mockReturnValue(null)
  }
}))

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('BadgeRecordCategory', () => {
  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with inactive state', () => {
    const item = {
      type: 'login',
      name: 'Logins'
    }

    const { getByText, toJSON } = renderWithProviders(
      <BadgeRecordCategory
        item={item}
        isActive={false}
        onPress={mockOnPress}
        quantity={5}
      />
    )

    expect(getByText('Logins 5')).toBeTruthy()
    expect(RECORD_ICON_BY_TYPE.login).toHaveBeenCalled()
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly with active state', () => {
    const item = {
      type: 'card',
      name: 'Cards'
    }

    const { getByText, toJSON } = renderWithProviders(
      <BadgeRecordCategory
        item={item}
        isActive={true}
        onPress={mockOnPress}
        quantity={3}
      />
    )

    expect(getByText('Cards 3')).toBeTruthy()
    expect(RECORD_ICON_BY_TYPE.card).toHaveBeenCalled()
    expect(toJSON()).toMatchSnapshot()
  })

  it('calls onPress when pressed', () => {
    const item = {
      type: 'note',
      name: 'Notes'
    }

    const { getByText } = renderWithProviders(
      <BadgeRecordCategory
        item={item}
        isActive={false}
        onPress={mockOnPress}
        quantity={10}
      />
    )

    fireEvent.press(getByText('Notes 10').parent)
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('applies correct colors based on active state', () => {
    const item = {
      type: 'login',
      name: 'Logins'
    }

    const { rerender, toJSON } = renderWithProviders(
      <BadgeRecordCategory item={item} isActive={false} onPress={mockOnPress} />
    )

    expect(toJSON()).toMatchSnapshot()

    rerender(
      <I18nProvider i18n={i18n}>
        <ThemeProvider>
          <BadgeRecordCategory
            item={item}
            isActive={true}
            onPress={mockOnPress}
          />
        </ThemeProvider>
      </I18nProvider>
    )

    expect(toJSON()).toMatchSnapshot()
  })

  it('renders without quantity when not provided', () => {
    const item = {
      type: 'login',
      name: 'Logins'
    }

    const { getByText } = renderWithProviders(
      <BadgeRecordCategory item={item} isActive={false} onPress={mockOnPress} />
    )

    expect(getByText('Logins ')).toBeTruthy()
  })
})
