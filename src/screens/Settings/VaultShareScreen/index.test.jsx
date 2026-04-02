import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'

import { VaultShareScreen } from './index'
import messages from '../../../locales/en/messages'

const mockGoBack = jest.fn()
const mockCopyToClipboard = jest.fn()
const mockCreateInvite = jest.fn()
const mockDeleteInvite = jest.fn()

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack
  })
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useInvite: () => ({
    createInvite: mockCreateInvite,
    deleteInvite: mockDeleteInvite,
    data: {
      publicKey: 'pear://pearpass/mock-vault-link'
    }
  })
}))

jest.mock('@tetherto/pear-apps-lib-ui-react-hooks', () => ({
  useCountDown: jest.fn(() => '0:24')
}))

jest.mock('@tetherto/pear-apps-utils-qr', () => ({
  generateQRCodeSVG: jest.fn(() => Promise.resolve('<svg />'))
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  ArrowDownIcon: (props) => {
    const { View } = require('react-native')
    return <View {...props} testID="arrow-down-icon" />
  },
  BackIcon: (props) => {
    const { View } = require('react-native')
    return <View {...props} testID="back-icon" />
  },
  CopyIcon: (props) => {
    const { View } = require('react-native')
    return <View {...props} testID="copy-icon" />
  }
}))

jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    black: { mode1: '#000000' },
    primary400: { mode1: '#B0D944' },
    white: { mode1: '#FFFFFF' }
  }
}))

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native')
  return {
    SafeAreaView: ({ children, ...props }) => <View {...props}>{children}</View>
  }
})

jest.mock('react-native-svg', () => {
  const { View } = require('react-native')

  const MockComponent = ({ children, ...props }) => (
    <View {...props}>{children}</View>
  )

  return {
    __esModule: true,
    default: MockComponent,
    Defs: MockComponent,
    LinearGradient: MockComponent,
    Rect: MockComponent,
    Stop: MockComponent,
    SvgXml: MockComponent
  }
})

jest.mock('../../../components/AppSwitch/AppSwitch', () => ({
  AppSwitch: ({ onChange, value, testID }) => {
    const { Text, TouchableOpacity } = require('react-native')
    return (
      <TouchableOpacity testID={testID} onPress={() => onChange(!value)}>
        <Text>{value ? 'on' : 'off'}</Text>
      </TouchableOpacity>
    )
  }
}))

jest.mock('../../../hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copyToClipboard: mockCopyToClipboard,
    isCopied: false
  })
}))

describe('VaultShareScreen', () => {
  const renderScreen = () =>
    render(
      <I18nProvider i18n={i18n}>
        <VaultShareScreen />
      </I18nProvider>
    )

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateInvite.mockResolvedValue(undefined)
    mockDeleteInvite.mockResolvedValue(undefined)
    mockCopyToClipboard.mockResolvedValue(true)
  })

  it('renders the invite QR flow and creates an invite on mount', async () => {
    const { getByText, getByTestId } = renderScreen()

    expect(getByText('Share Personal Vault')).toBeTruthy()
    expect(getByText('Code expires in 0:24')).toBeTruthy()

    await waitFor(() => expect(mockCreateInvite).toHaveBeenCalled())
    await waitFor(() => expect(getByTestId('vault-share-qr-code')).toBeTruthy())
  })

  it('copies the vault link and cycles the expiry value', async () => {
    const { getByTestId, getByText } = renderScreen()

    await waitFor(() =>
      expect(getByText('pear://pearpass/mock-vault-link')).toBeTruthy()
    )

    fireEvent.press(getByTestId('vault-share-copy-link-button'))
    expect(mockCopyToClipboard).toHaveBeenCalledWith(
      'pear://pearpass/mock-vault-link'
    )

    fireEvent.press(getByTestId('vault-share-access-expires-button'))
    expect(getByText('15 minutes')).toBeTruthy()
  })

  it('navigates back and deletes the invite on unmount', async () => {
    const { getByTestId, unmount } = renderScreen()

    fireEvent.press(getByTestId('vault-share-back-button'))
    expect(mockGoBack).toHaveBeenCalled()

    unmount()

    await waitFor(() => expect(mockDeleteInvite).toHaveBeenCalled())
  })
})
