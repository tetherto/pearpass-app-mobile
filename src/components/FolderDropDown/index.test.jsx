import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { FolderDropDown } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (text) => text
  })
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  ArrowDownIcon: () => 'ArrowDownIcon',
  FolderIcon: () => 'FolderIcon'
}))

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('FolderDropDown component', () => {
  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly with selected folder', () => {
    const { getByText, toJSON } = renderWithProviders(
      <FolderDropDown onPress={mockOnPress} selectedFolder="Test Folder" />
    )

    expect(getByText('Test Folder')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  test('renders correctly without selected folder', () => {
    const { getByText, toJSON } = renderWithProviders(
      <FolderDropDown onPress={mockOnPress} />
    )

    expect(getByText('No Folder')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  test('calls onPress when pressed', () => {
    const { getByText } = renderWithProviders(
      <FolderDropDown onPress={mockOnPress} selectedFolder="Test Folder" />
    )

    fireEvent.press(getByText('Test Folder'))
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  test('renders with empty string as selected folder', () => {
    const { getByText } = renderWithProviders(
      <FolderDropDown onPress={mockOnPress} selectedFolder="" />
    )

    expect(getByText('No Folder')).toBeTruthy()
  })
})
