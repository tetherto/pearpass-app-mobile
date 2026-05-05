import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render } from '@testing-library/react-native'

import { CreatePasswordScreen } from './CreatePasswordScreen'
import { messages } from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockNavigate = jest.fn()
const mockSubmit = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  })
}))

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')

  return {
    Button: ({ children, onClick, disabled, 'data-testid': dataTestId }) => (
      <RN.Pressable
        testID={dataTestId}
        onPress={() => {
          if (!disabled) {
            onClick?.()
          }
        }}
      >
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    ),
    Text: ({ children, style, 'data-testid': dataTestId }) => (
      <RN.Text testID={dataTestId} style={style}>
        {children}
      </RN.Text>
    ),
    Link: ({ children, onClick, 'data-testid': dataTestId }) => (
      <RN.Pressable testID={dataTestId} onPress={onClick}>
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    ),
    AlertMessage: () => null,
    useTheme: () => ({
      theme: { colors: {} }
    }),
    rawTokens: new Proxy({}, { get: () => 0 })
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => ({
  KeyboardArrowRightFilled: () => null
}))

jest.mock('../../../hooks/useKeyboardVisibility', () => ({
  useKeyboardVisibility: () => ({
    isKeyboardVisible: false
  })
}))

jest.mock('../../../utils/unsupportedFeatures', () => ({
  unsupportedFeaturesEnabled: () => true
}))

jest.mock('../hooks/usePasswordCreation', () => ({
  usePasswordCreation: () => ({
    passwordRegisterProps: { value: 'StrongVault#2026' },
    passwordConfirmRegisterProps: {
      value: 'StrongVault#2026',
      error: null
    },
    handlePasswordChange: jest.fn(),
    handlePasswordConfirmChange: jest.fn(),
    passwordIndicatorVariant: 'strong',
    passwordsMatch: true,
    canSubmit: true,
    isLoading: false,
    submit: mockSubmit
  })
}))

jest.mock('../../../containers/Auth/shared/AuthFlowFormLayout', () => {
  const RN = require('react-native')

  return {
    AuthFlowFormLayout: ({ title, subtitle, children, footer }) => (
      <RN.View>
        <RN.Text>{title}</RN.Text>
        <RN.Text>{subtitle}</RN.Text>
        {children}
        {footer}
      </RN.View>
    )
  }
})

jest.mock('../../../containers/Auth/shared/ConfirmablePasswordFields', () => {
  const RN = require('react-native')

  return {
    ConfirmablePasswordFields: () => (
      <RN.View testID="confirmable-password-fields" />
    )
  }
})

const renderWithProviders = (ui) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

describe('CreatePasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('navigates to transfer data flow from the subtitle link', () => {
    const { getByTestId } = renderWithProviders(<CreatePasswordScreen />)

    fireEvent.press(getByTestId('onboarding-v2-transfer-data-link'))

    expect(mockNavigate).toHaveBeenCalledWith('Welcome', {
      state: 'enterMasterPassword'
    })
  })

  it('continues to autofill onboarding after successful submit', () => {
    mockSubmit.mockImplementation((onSuccess) => onSuccess('Master#2026'))

    const { getByTestId } = renderWithProviders(<CreatePasswordScreen />)

    fireEvent.press(getByTestId('onboarding-v2-create-password-continue'))

    expect(mockSubmit).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('OnboardingV2Autofill', {
      password: 'Master#2026'
    })
  })
})
