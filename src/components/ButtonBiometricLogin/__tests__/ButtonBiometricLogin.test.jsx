import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'
jest.mock('expo-local-authentication', () => ({
  AuthenticationType: {
    FACIAL_RECOGNITION: 1,
    FINGERPRINT: 2
  }
}))
import * as LocalAuthentication from 'expo-local-authentication'
import { ThemeProvider } from 'src/utils/colors'

import { ButtonBiometricLogin } from '..'

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn()
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn()
}))

jest.mock('../../../hooks/useBiometricsAuthentication', () => ({
  useBiometricsAuthentication: jest.fn()
}))

jest.mock('../../../utils/biometricLogin', () => ({
  isFacialRecognitionSupported: jest.fn(),
  isFingerprintSupported: jest.fn()
}))

jest.mock('../../BiometricWithIconAndText', () => {
  const testIdForType = (type) => `biometric-${type}`
  return {
    BiometricWithIconAndText: ({ biometricType }) => (
      <mock-BiometricWithIconAndText testID={testIdForType(biometricType)} />
    )
  }
})

const renderWithProviders = (ui) => {
  i18n.activate('en')
  return render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={{ colors: { primary400: { mode1: '#000' } } }}>
        {ui}
      </ThemeProvider>
    </I18nProvider>
  )
}

describe('ButtonBiometricLogin', () => {
  const {
    useBiometricsAuthentication
  } = require('../../../hooks/useBiometricsAuthentication')
  const {
    isFacialRecognitionSupported,
    isFingerprintSupported
  } = require('../../../utils/biometricLogin')

  const mockOnBiometricLogin = jest.fn()
  const fingerprintId = `biometric-${LocalAuthentication.AuthenticationType.FINGERPRINT}`
  const facialId = `biometric-${LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION}`
  const bothBiometricsId = `biometric-${LocalAuthentication.AuthenticationType.FINGERPRINT}-${LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION}`
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders only faceID when only facialRecognition is supported', () => {
    useBiometricsAuthentication.mockReturnValue({
      isBiometricsEnabled: true,
      isBiometricsSupported: true,
      biometricTypes: [
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      ]
    })
    isFacialRecognitionSupported.mockReturnValue(true)
    isFingerprintSupported.mockReturnValue(false)

    const { queryByTestId } = renderWithProviders(
      <ButtonBiometricLogin onBiometricLogin={mockOnBiometricLogin} />
    )

    expect(queryByTestId(facialId)).toBeTruthy()
    expect(queryByTestId(fingerprintId)).toBeNull()
  })

  it('renders only fingerprint when only fingerprint is supported', () => {
    useBiometricsAuthentication.mockReturnValue({
      isBiometricsEnabled: true,
      isBiometricsSupported: true,
      biometricTypes: [LocalAuthentication.AuthenticationType.FINGERPRINT]
    })
    isFacialRecognitionSupported.mockReturnValue(false)
    isFingerprintSupported.mockReturnValue(true)

    const { queryByTestId } = renderWithProviders(
      <ButtonBiometricLogin onBiometricLogin={mockOnBiometricLogin} />
    )

    expect(queryByTestId(fingerprintId)).toBeTruthy()
    expect(queryByTestId(facialId)).toBeNull()
  })

  it('renders single button when both are supported', () => {
    useBiometricsAuthentication.mockReturnValue({
      isBiometricsEnabled: true,
      isBiometricsSupported: true,
      biometricTypes: [
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        LocalAuthentication.AuthenticationType.FINGERPRINT
      ]
    })
    isFacialRecognitionSupported.mockReturnValue(true)
    isFingerprintSupported.mockReturnValue(true)

    const { queryByTestId } = renderWithProviders(
      <ButtonBiometricLogin onBiometricLogin={mockOnBiometricLogin} />
    )

    // When both are supported the component renders a single combined button
    expect(queryByTestId(bothBiometricsId)).toBeTruthy()
    expect(queryByTestId(facialId)).toBeNull()
    expect(queryByTestId(fingerprintId)).toBeNull()
  })

  it('renders null when no biometrics enabled or none supported', () => {
    useBiometricsAuthentication.mockReturnValue({
      isBiometricsEnabled: true,
      isBiometricsSupported: false,
      biometricTypes: []
    })
    isFacialRecognitionSupported.mockReturnValue(false)
    isFingerprintSupported.mockReturnValue(false)

    const { toJSON } = renderWithProviders(
      <ButtonBiometricLogin onBiometricLogin={mockOnBiometricLogin} />
    )

    expect(toJSON()).toBeNull()
  })
})
