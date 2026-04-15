import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'

import { VaultSettingsScreen } from './index'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import { ModifyVaultModalContentV2 } from '../../../containers/Modal/ModifyVaultModalContentV2'
import messages from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockNavigate = jest.fn()
const mockOpenModal = jest.fn()
const mockCloseModal = jest.fn()
const mockExpand = jest.fn()
const mockCollapse = jest.fn()
const mockUseVault = jest.fn()
const mockIsModifyVaultModalV2Enabled = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn()
  })
}))

jest.mock('@gorhom/bottom-sheet', () => {
  const RN = require('react-native')

  return {
    BottomSheetScrollView: ({ children }) => <RN.View>{children}</RN.View>
  }
})

jest.mock('@tetherto/pear-apps-utils-date', () => ({
  formatDate: () => '01/01/2026'
}))

jest.mock('@tetherto/pearpass-lib-constants', () => ({
  PROTECTED_VAULT_ENABLED: true
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  BackIcon: () => null,
  KebabMenuIcon: () => null
}))

jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    grey500: { mode1: '#080A05' },
    white: { mode1: '#FFFFFF' },
    primary400: { mode1: '#A3E635' }
  }
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useVault: () => mockUseVault()
}))

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native')
  return {
    SafeAreaView: ({ children, ...props }) => <View {...props}>{children}</View>
  }
})

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn()
  }
}))

jest.mock('../../../context/BottomSheetContext', () => ({
  useBottomSheet: () => ({
    expand: mockExpand,
    collapse: mockCollapse
  })
}))

jest.mock('../../../context/ModalContext', () => ({
  useModal: () => ({
    openModal: mockOpenModal,
    closeModal: mockCloseModal
  })
}))

jest.mock('../../../libComponents', () => {
  const RN = require('react-native')

  return {
    ButtonLittle: ({ onPress }) => (
      <RN.Pressable onPress={onPress}>
        <RN.Text>little-button</RN.Text>
      </RN.Pressable>
    ),
    ButtonPrimary: ({ children, onPress }) => (
      <RN.Pressable onPress={onPress}>
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    ),
    ButtonSecondary: ({ children, onPress }) => (
      <RN.Pressable onPress={onPress}>
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    )
  }
})

jest.mock('../../../containers/BottomSheetVaultAction', () => ({
  BottomSheetVaultAction: () => null
}))

jest.mock('../../../containers/Modal/ConfirmModalContent', () => ({
  ConfirmModalContent: () => null
}))

jest.mock('../../../containers/Modal/ModifyVaultModalContentV2', () => ({
  ModifyVaultModalContentV2: () => null
}))

jest.mock('../../../utils/modifyVaultModalV2Flag', () => ({
  isModifyVaultModalV2Enabled: () => mockIsModifyVaultModalV2Enabled()
}))

const renderWithProviders = (ui) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

describe('VaultSettingsScreen V2 modal flag', () => {
  const isVaultProtected = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseVault.mockReturnValue({
      data: {
        id: 'vault-1',
        name: 'Personal Vault',
        createdAt: '2026-01-01',
        devices: []
      },
      isVaultProtected
    })

    isVaultProtected.mockResolvedValue(false)
  })

  it('opens ModifyVaultModalContentV2 for rename when the feature flag is enabled', async () => {
    mockIsModifyVaultModalV2Enabled.mockReturnValue(true)

    const { getByText } = renderWithProviders(
      <VaultSettingsScreen route={{ params: { vaultId: 'vault-1' } }} />
    )

    await waitFor(() =>
      expect(isVaultProtected).toHaveBeenCalledWith('vault-1')
    )

    fireEvent.press(getByText('Rename Vault'))

    expect(mockOpenModal).toHaveBeenCalledTimes(1)
    const modalElement = mockOpenModal.mock.calls[0][0]

    expect(modalElement.type).toBe(ModifyVaultModalContentV2)
    expect(modalElement.props).toMatchObject({
      vaultId: 'vault-1',
      vaultName: 'Personal Vault',
      action: VAULT_ACTION.NAME
    })
    expect(mockNavigate).not.toHaveBeenCalledWith(
      'VaultRenameScreen',
      expect.anything()
    )
  })

  it('keeps the legacy rename navigation when the feature flag is disabled', async () => {
    mockIsModifyVaultModalV2Enabled.mockReturnValue(false)

    const { getByText } = renderWithProviders(
      <VaultSettingsScreen route={{ params: { vaultId: 'vault-1' } }} />
    )

    await waitFor(() =>
      expect(isVaultProtected).toHaveBeenCalledWith('vault-1')
    )

    fireEvent.press(getByText('Rename Vault'))

    expect(mockOpenModal).not.toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('VaultRenameScreen', {
      vaultId: 'vault-1',
      vaultName: 'Personal Vault'
    })
  })
})
