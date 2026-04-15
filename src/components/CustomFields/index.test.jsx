import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { View } from 'react-native'

import { CustomFields } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (strings) => strings[0]
  })
}))

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('CustomFields component', () => {
  const mockRegister = jest.fn((field, index) => ({
    testID: `${field}-${index}`,
    value: `test-${field}-value`
  }))
  const mockRemoveItem = jest.fn()
  const mockOnClick = jest.fn()

  const customFieldsData = [
    { id: '1', type: 'note', note: 'Test note 1' },
    { id: '2', type: 'note', note: 'Test note 2' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly with note custom fields', () => {
    const { getByTestId, toJSON } = renderWithProviders(
      <View testID="custom-fields">
        <CustomFields
          customFields={customFieldsData}
          register={mockRegister}
          removeItem={mockRemoveItem}
          areInputsDisabled={false}
          onClick={mockOnClick}
        />
      </View>
    )

    const element = getByTestId('custom-fields')?.children[0]

    expect(element.children).toHaveLength(2)
    expect(toJSON()).toMatchSnapshot()
  })

  test('renders nothing when customFields is empty', () => {
    const { getByTestId } = renderWithProviders(
      <View testID="custom-fields">
        <CustomFields
          customFields={[]}
          register={mockRegister}
          removeItem={mockRemoveItem}
          areInputsDisabled={false}
          onClick={mockOnClick}
        />
      </View>
    )
    const element = getByTestId('custom-fields')?.children[0]

    expect(element.children.length).toBe(0)
  })

  test('handles undefined values correctly', () => {
    const { getByTestId } = renderWithProviders(
      <View testID="custom-fields">
        <CustomFields register={mockRegister} />
      </View>
    )

    const element = getByTestId('custom-fields')?.children[0]

    expect(element.children.length).toBe(0)
  })
})
