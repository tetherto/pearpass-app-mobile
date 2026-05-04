import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'

import { PairAnotherDeviceContent } from './PairAnotherDeviceContent'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockCamera = jest.fn(() => <View testID="camera" />)
const mockSetShowScanner = jest.fn()

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (strings, ...values) =>
      Array.isArray(strings)
        ? strings.reduce(
            (acc, str, index) => acc + str + (values[index] ?? ''),
            ''
          )
        : strings
  })
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: jest.fn()
  })
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  PasteFromClipboardIcon: () => null,
  QrCodeIcon: () => null
}))

jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    primary400: { mode1: '#00aa55' },
    grey400: { mode1: '#333333' },
    grey100: { mode1: '#666666' },
    grey500: { mode1: '#222222' },
    grey200: { mode1: '#999999' },
    white: { mode1: '#ffffff' }
  }
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useVault: () => ({
    refetch: jest.fn(),
    addDevice: jest.fn()
  }),
  usePair: () => ({
    pairActiveVault: jest.fn(),
    cancelPairActiveVault: jest.fn(),
    isLoading: false
  })
}))

jest.mock('expo-clipboard', () => ({
  getStringAsync: jest.fn()
}))

jest.mock('react-native-vision-camera', () => ({
  Camera: (props) => {
    const { View } = require('react-native')
    mockCamera(props)
    return <View testID="camera" />
  }
}))

jest.mock('../../context/BottomSheetContext', () => ({
  useBottomSheet: () => ({
    collapse: jest.fn()
  })
}))

jest.mock('../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    hapticButtonSecondary: jest.fn()
  })
}))

jest.mock('../../hooks/useQRScanner', () => {
  const { useRef } = require('react')
  return {
    useQRScanner: () => ({
      hasPermission: true,
      codeScanner: { onCodeScanned: jest.fn(), codeTypes: ['qr'] },
      device: { id: 'back' },
      cameraRef: useRef(null),
      pauseScanning: jest.fn(),
      requestPermission: jest.fn()
    })
  }
})

jest.mock('../../libComponents', () => ({
  ButtonPrimary: ({ children }) => {
    const { Text } = require('react-native')
    return <Text>{children}</Text>
  },
  ButtonSecondary: ({ children }) => {
    const { Text } = require('react-native')
    return <Text>{children}</Text>
  }
}))

const renderWithProviders = (ui) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

describe('PairAnotherDeviceContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('passes the hook-provided code scanner to Camera in scanner mode', () => {
    renderWithProviders(
      <PairAnotherDeviceContent
        tabs={<Text>Tabs</Text>}
        showScanner
        setShowScanner={mockSetShowScanner}
      />
    )

    expect(mockCamera).toHaveBeenCalledWith(
      expect.objectContaining({
        codeScanner: expect.objectContaining({
          codeTypes: ['qr'],
          onCodeScanned: expect.any(Function)
        }),
        isActive: true
      })
    )
    expect(mockCamera.mock.calls[0][0]).not.toHaveProperty('frameProcessor')
  })
})
