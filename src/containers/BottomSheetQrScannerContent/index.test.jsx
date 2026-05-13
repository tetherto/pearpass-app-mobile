import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'
import { ThemeProvider } from 'styled-components/native'

import { BottomSheetQrScannerContent } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockCamera = jest.fn(() => <View testID="camera" />)
const mockSetShouldBypassAutoLock = jest.fn()
const mockPauseScanning = jest.fn()
const mockPickImageForScan = jest.fn()
const mockRequestPermission = jest.fn()

jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetScrollView: ({ children }) => {
    const { View } = require('react-native')
    return <View>{children}</View>
  }
}))

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

jest.mock('react-native-vision-camera', () => ({
  Camera: (props) => {
    const { View } = require('react-native')
    mockCamera(props)
    return <View testID="camera" />
  }
}))

jest.mock('../../context/AutoLockContext', () => ({
  useAutoLockContext: () => ({
    setShouldBypassAutoLock: mockSetShouldBypassAutoLock
  })
}))

jest.mock('../../hooks/useQRScanner', () => ({
  useQRScanner: () => ({
    hasPermission: true,
    codeScanner: { onCodeScanned: jest.fn(), codeTypes: ['qr'] },
    device: { id: 'back' },
    frameProcessor: undefined,
    pauseScanning: mockPauseScanning,
    pickImageForScan: mockPickImageForScan,
    requestPermission: mockRequestPermission
  })
}))

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

const theme = {
  colors: {
    primary400: { mode1: '#00aa55' },
    white: { mode1: '#ffffff' }
  }
}

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('BottomSheetQrScannerContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('passes the hook-provided code scanner to Camera', () => {
    renderWithProviders(<BottomSheetQrScannerContent onScanned={jest.fn()} />)

    expect(mockCamera).toHaveBeenCalledWith(
      expect.objectContaining({
        codeScanner: expect.objectContaining({
          codeTypes: ['qr'],
          onCodeScanned: expect.any(Function)
        }),
        frameProcessor: undefined,
        isActive: true
      })
    )
  })
})
