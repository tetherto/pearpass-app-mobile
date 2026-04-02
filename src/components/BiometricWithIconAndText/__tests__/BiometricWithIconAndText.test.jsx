import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { ThemeProvider } from 'styled-components/native'

import { BiometricWithIconAndText } from '..'

jest.mock('expo-local-authentication', () => ({
  AuthenticationType: {
    FACIAL_RECOGNITION: 1,
    FINGERPRINT: 2
  }
}))

beforeAll(() => {
  i18n.activate('en')
})

// Mock icon components to simple test components
jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  FaceIdIcon: (props) => <mock-FaceIdIcon testID="face-icon" {...props} />,
  FingerprintIcon: (props) => (
    <mock-FingerprintIcon testID="fingerprint-icon" {...props} />
  )
}))

// Mock theme provider colors usage to a simple object if needed
jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    primary400: { mode1: '#000' }
  }
}))

describe('BiometricWithIconAndText', () => {
  it('renders Face ID variant with correct icon and label', () => {
    const { getByTestId, getByText } = render(
      <I18nProvider i18n={i18n}>
        <ThemeProvider theme={{ colors: { primary400: { mode1: '#000' } } }}>
          <BiometricWithIconAndText
            biometricType={
              LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            }
            onPress={() => {}}
          />
        </ThemeProvider>
      </I18nProvider>
    )

    expect(getByTestId('face-icon')).toBeTruthy()
    const label = getByTestId('biometric-login-button')
    expect(label).toBeTruthy()
    expect(getByText('Use Face ID')).toBeTruthy()
  })

  it('renders Fingerprint variant with correct icon and label', () => {
    const { getByTestId, getByText } = render(
      <I18nProvider i18n={i18n}>
        <ThemeProvider theme={{ colors: { primary400: { mode1: '#000' } } }}>
          <BiometricWithIconAndText
            biometricType={LocalAuthentication.AuthenticationType.FINGERPRINT}
            onPress={() => {}}
          />
        </ThemeProvider>
      </I18nProvider>
    )

    expect(getByTestId('fingerprint-icon')).toBeTruthy()
    const label = getByTestId('biometric-login-button')
    expect(label).toBeTruthy()
    expect(getByText('Use Fingerprint')).toBeTruthy()
  })

  it('renders combined biometrics variant with no icon and correct label', () => {
    const { queryByTestId, getByText } = render(
      <I18nProvider i18n={i18n}>
        <ThemeProvider theme={{ colors: { primary400: { mode1: '#000' } } }}>
          <BiometricWithIconAndText
            biometricType={`${LocalAuthentication.AuthenticationType.FINGERPRINT}-${LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION}`}
            onPress={() => {}}
          />
        </ThemeProvider>
      </I18nProvider>
    )

    expect(queryByTestId('face-icon')).toBeNull()
    expect(queryByTestId('fingerprint-icon')).toBeNull()
    const label = getByText('Use Biometrics')
    expect(label).toBeTruthy()
  })
})
