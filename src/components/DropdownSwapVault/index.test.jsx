import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { StyleSheet, View } from 'react-native'

import { DropdownSwapVault } from '.'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (strings) => strings[0]
  })
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useVault: () => ({
    refetch: jest.fn(),
    isVaultProtected: jest.fn().mockResolvedValue(false)
  })
}))

jest.mock('./styles', () => {
  const actualModule = jest.requireActual('./styles')
  return {
    ...actualModule,
    DropdownWrapper: (props) => (
      <div {...props} testID="dropdown-wrapper">
        {props.children}
      </div>
    )
  }
})

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('DropdownSwapVault component', () => {
  const mockOnVaultSwap = jest.fn()

  const vaults = [{ id: 'vault2' }, { id: 'vault3' }]
  const selectedVault = { id: 'vault1' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly with vaults', () => {
    const { getByTestId, toJSON } = renderWithProviders(
      <View testID="dropdown-swap-vault">
        <DropdownSwapVault
          vaults={vaults}
          selectedVault={selectedVault}
          onVaultSwap={mockOnVaultSwap}
        />
      </View>
    )

    const element = getByTestId('dropdown-swap-vault')?.children[0]

    expect(element.children).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  test('does not render when vaults list is empty', () => {
    const { queryByText } = renderWithProviders(
      <DropdownSwapVault
        vaults={[]}
        selectedVault={null}
        onVaultSwap={mockOnVaultSwap}
      />
    )
    expect(queryByText('vault1')).toBeNull()
  })

  test('toggles dropdown on press', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <DropdownSwapVault
        vaults={vaults}
        selectedVault={selectedVault}
        onVaultSwap={mockOnVaultSwap}
      />
    )

    const dropdownTrigger = getByText('vault1')

    const animatedView = getByTestId('dropdown-wrapper')

    expect(animatedView.props.isOpen).toBe(false)

    fireEvent.press(dropdownTrigger)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const flattenedStyle = StyleSheet.flatten(animatedView.props.style)

    expect(animatedView.props.isOpen).toBe(true)
    // eslint-disable-next-line no-underscore-dangle
    expect(flattenedStyle.maxHeight._value).toBe(1000)
  })

  test('selects a vault and triggers onVaultSwap', async () => {
    const { getByText } = renderWithProviders(
      <DropdownSwapVault
        vaults={vaults}
        selectedVault={selectedVault}
        onVaultSwap={mockOnVaultSwap}
      />
    )

    const dropdownTrigger = getByText('vault1')
    fireEvent.press(dropdownTrigger)

    const vaultOption = getByText('vault2')
    fireEvent.press(vaultOption)

    await waitFor(() => {
      expect(mockOnVaultSwap).toHaveBeenCalled()
    })
  })
})
