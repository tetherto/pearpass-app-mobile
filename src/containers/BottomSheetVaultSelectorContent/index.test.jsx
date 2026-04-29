import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render } from '@testing-library/react-native'

import { BottomSheetVaultSelectorContent } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockSwitchVault = jest.fn()
const mockUseVaults = jest.fn()
const mockUseVault = jest.fn()
const mockCollapse = jest.fn()
const mockOpenModal = jest.fn()
const mockCloseModal = jest.fn()
const mockOnRequestClose = jest.fn()
const mockOnCreateVault = jest.fn()
const mockOnNavigate = jest.fn()
const mockIsModifyVaultModalV2Enabled = jest.fn(() => false)

jest.mock('../../hooks/useVaultSwitch', () => ({
  useVaultSwitch: () => ({ switchVault: mockSwitchVault })
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useVaults: () => mockUseVaults(),
  useVault: () => mockUseVault()
}))

jest.mock('../../context/ModalContext', () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: mockCloseModal
  })
}))

jest.mock('../../utils/modifyVaultModalV2Flag', () => ({
  isModifyVaultModalV2Enabled: () => mockIsModifyVaultModalV2Enabled()
}))

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => {
  const RN = require('react-native')
  return {
    Add: () => <RN.View testID="icon-add" />,
    LockFilled: () => <RN.View testID="icon-lock" />,
    MoreVert: () => <RN.View testID="icon-more" />
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')
  return {
    Button: ({ onClick, children, 'aria-label': ariaLabel }) => (
      <RN.TouchableOpacity
        testID={ariaLabel ? 'vault-overflow-btn' : 'generic-kit-button'}
        onPress={onClick}
      >
        <RN.Text>{children}</RN.Text>
      </RN.TouchableOpacity>
    ),
    ListItem: ({
      title,
      onClick,
      selected,
      rightElement,
      icon: _icon,
      style: _style,
      showDivider: _showDivider,
      iconSize: _iconSize
    }) => (
      <RN.View testID={`list-item-${String(title)}`}>
        <RN.Text>{title}</RN.Text>
        <RN.Text testID={`selected-flag-${String(title)}`}>
          {String(!!selected)}
        </RN.Text>
        <RN.TouchableOpacity
          testID={`list-item-press-${String(title)}`}
          onPress={onClick}
        />
        {rightElement}
      </RN.View>
    ),
    rawTokens: {
      spacing16: 16
    },
    useBottomSheetClose: () => mockCollapse,
    useTheme: () => ({
      theme: {
        colors: {
          colorTextPrimary: '#111111'
        }
      }
    })
  }
})

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 16 })
}))

jest.mock('../BottomSheet/SheetHeader', () => {
  const RN = require('react-native')
  return {
    SheetHeader: ({ title, onClose }) => (
      <RN.View testID="sheet-header">
        <RN.Text testID="sheet-header-title">{title}</RN.Text>
        <RN.TouchableOpacity testID="sheet-header-close" onPress={onClose} />
      </RN.View>
    )
  }
})

jest.mock('../Layout', () => {
  const RN = require('react-native')
  return {
    Layout: ({ header, children }) => (
      <RN.View testID="sheet-layout">
        {header}
        {children}
      </RN.View>
    )
  }
})

jest.mock('../BottomSheetVaultAction', () => {
  const RN = require('react-native')
  return {
    BottomSheetVaultAction: ({
      vaultName,
      onBack,
      onClose,
      onRename,
      onPassword
    }) => (
      <RN.View testID="vault-actions-panel">
        <RN.Text testID="vault-actions-name">{vaultName}</RN.Text>
        <RN.TouchableOpacity testID="vault-actions-back" onPress={onBack} />
        <RN.TouchableOpacity testID="vault-actions-close" onPress={onClose} />
        <RN.TouchableOpacity testID="vault-action-rename" onPress={onRename} />
        <RN.TouchableOpacity
          testID="vault-action-password"
          onPress={onPassword}
        />
      </RN.View>
    )
  }
})

jest.mock('../Modal/ModifyVaultModalContentV2', () => ({
  ModifyVaultModalContentV2: () => null
}))

const vaults = [
  { id: 'v-active', name: 'Active Vault' },
  { id: 'v-other', name: 'Other Vault' }
]

const renderSheet = (props = {}) =>
  render(
    <I18nProvider i18n={i18n}>
      <BottomSheetVaultSelectorContent
        onRequestClose={mockOnRequestClose}
        onCreateVault={mockOnCreateVault}
        onNavigate={mockOnNavigate}
        {...props}
      />
    </I18nProvider>
  )

describe('BottomSheetVaultSelectorContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsModifyVaultModalV2Enabled.mockReturnValue(false)
    mockUseVaults.mockReturnValue({
      data: vaults
    })
    mockUseVault.mockReturnValue({
      data: vaults[0]
    })
  })

  it('renders header title and vault rows with selection flag', () => {
    const { getByTestId } = renderSheet()

    expect(getByTestId('sheet-header-title').props.children).toBe('Vaults')
    expect(getByTestId('selected-flag-Active Vault').props.children).toBe(
      'true'
    )
    expect(getByTestId('selected-flag-Other Vault').props.children).toBe(
      'false'
    )
  })

  it('calls switchVault when a vault row is pressed', () => {
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('list-item-press-Other Vault'))

    expect(mockSwitchVault).toHaveBeenCalledWith(vaults[1])
  })

  it('shows overflow actions for the active vault and opens the actions panel', () => {
    const { getByTestId, queryByTestId } = renderSheet()

    expect(getByTestId('vault-overflow-btn')).toBeTruthy()

    fireEvent.press(getByTestId('vault-overflow-btn'))

    expect(queryByTestId('vault-actions-panel')).toBeTruthy()
    expect(getByTestId('vault-actions-name').props.children).toBe(
      'Active Vault'
    )
  })

  it('returns from actions panel to the vault list when back is pressed', () => {
    const { getByTestId, queryByTestId } = renderSheet()

    fireEvent.press(getByTestId('vault-overflow-btn'))
    expect(queryByTestId('vault-actions-panel')).toBeTruthy()

    fireEvent.press(getByTestId('vault-actions-back'))

    expect(queryByTestId('vault-actions-panel')).toBeNull()
    expect(getByTestId('sheet-header-title')).toBeTruthy()
  })

  it('closes via actions panel onClose using collapse and onRequestClose', () => {
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('vault-overflow-btn'))
    fireEvent.press(getByTestId('vault-actions-close'))

    expect(mockOnRequestClose).toHaveBeenCalled()
    expect(mockCollapse).toHaveBeenCalled()
  })

  it('closes from header close using collapse and onRequestClose', () => {
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('sheet-header-close'))

    expect(mockOnRequestClose).toHaveBeenCalled()
    expect(mockCollapse).toHaveBeenCalled()
  })

  it('closes sheet and calls onCreateVault when Create New Vault is pressed', () => {
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('list-item-press-Create New Vault'))

    expect(mockOnRequestClose).toHaveBeenCalled()
    expect(mockCollapse).toHaveBeenCalled()
    expect(mockOnCreateVault).toHaveBeenCalled()
  })

  it('calls onNavigate for rename when modify vault v2 is disabled', () => {
    mockIsModifyVaultModalV2Enabled.mockReturnValue(false)
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('vault-overflow-btn'))
    fireEvent.press(getByTestId('vault-action-rename'))

    expect(mockOnNavigate).toHaveBeenCalledWith('VaultRenameScreen', {
      vaultId: 'v-active',
      vaultName: 'Active Vault'
    })
  })

  it('opens modal for rename when modify vault v2 is enabled', () => {
    mockIsModifyVaultModalV2Enabled.mockReturnValue(true)
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('vault-overflow-btn'))
    fireEvent.press(getByTestId('vault-action-rename'))

    expect(mockOpenModal).toHaveBeenCalled()
    expect(mockOnNavigate).not.toHaveBeenCalled()
  })

  it('calls onNavigate for password when modify vault v2 is disabled', () => {
    mockIsModifyVaultModalV2Enabled.mockReturnValue(false)
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('vault-overflow-btn'))
    fireEvent.press(getByTestId('vault-action-password'))

    expect(mockOnNavigate).toHaveBeenCalledWith('VaultPasswordScreen', {
      vaultId: 'v-active',
      vaultName: 'Active Vault'
    })
  })
})
