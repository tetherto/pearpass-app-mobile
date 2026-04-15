import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import Toast from 'react-native-toast-message'

import { ModifyVaultModalContentV2 } from './index'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import messages from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockUseVault = jest.fn()
const mockValidatePasswordChange = jest.fn()
const mockCloseModal = jest.fn()
const mockLoggerError = jest.fn()

jest.mock('@tetherto/pear-apps-lib-ui-react-hooks', () => {
  const React = require('react')

  return {
    useForm: ({ initialValues, validate }) => {
      const [values, setValues] = React.useState(initialValues)
      const [errors, setErrorsState] = React.useState({})

      const register = (name) => ({
        value: values[name] || '',
        error: errors[name],
        onChange: (value) => {
          setValues((current) => ({ ...current, [name]: value }))
          setErrorsState((current) => ({ ...current, [name]: undefined }))
        }
      })

      const handleSubmit = (onSubmit) => async () => {
        const validationErrors = validate?.(values) || {}

        if (Object.keys(validationErrors).length > 0) {
          setErrorsState(validationErrors)
          return
        }

        await onSubmit(values)
      }

      const setErrors = (nextErrors) => {
        setErrorsState((current) => ({ ...current, ...nextErrors }))
      }

      return {
        register,
        handleSubmit,
        setErrors
      }
    }
  }
})

jest.mock('@tetherto/pear-apps-utils-validator', () => ({
  Validator: {
    string: () => {
      const validator = {
        requiredMessage: null,
        required(message) {
          validator.requiredMessage = message
          return validator
        }
      }

      return validator
    },
    object: (shape) => ({
      validate(values) {
        return Object.entries(shape).reduce((errors, [key, validator]) => {
          if (validator.requiredMessage && !values[key]) {
            return { ...errors, [key]: validator.requiredMessage }
          }

          return errors
        }, {})
      }
    })
  }
}))

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')

  return {
    AlertMessage: ({ title, description, testID }) => (
      <RN.View testID={testID}>
        <RN.Text>{title}</RN.Text>
        <RN.Text>{description}</RN.Text>
      </RN.View>
    ),
    Button: ({ children, onClick, disabled, testID }) => (
      <RN.Pressable
        testID={testID}
        onPress={() => {
          if (!disabled) {
            onClick?.()
          }
        }}
      >
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    ),
    InputField: ({ label, value, onChangeText, error, testID }) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
        />
        {error ? <RN.Text>{error}</RN.Text> : null}
      </RN.View>
    ),
    PageHeader: ({ title, subtitle, testID }) => (
      <RN.View testID={testID}>
        <RN.Text>{title}</RN.Text>
        <RN.Text>{subtitle}</RN.Text>
      </RN.View>
    ),
    PasswordField: ({ label, value, onChangeText, error, testID }) => (
      <RN.View>
        <RN.Text>{label}</RN.Text>
        <RN.TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
        />
        {error ? <RN.Text>{error}</RN.Text> : null}
      </RN.View>
    ),
    rawTokens: {
      spacing12: 12,
      spacing16: 16,
      spacing20: 20
    },
    useTheme: () => ({
      theme: {
        colors: {
          colorSurfacePrimary: '#0A0A0A',
          colorBorderPrimary: '#202020'
        }
      }
    })
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => ({
  ReportProblem: () => null
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useVault: () => mockUseVault()
}))

jest.mock('@tetherto/pearpass-utils-password-check', () => ({
  checkPasswordStrength: () => ({
    type: 'safe'
  }),
  validatePasswordChange: (...args) => mockValidatePasswordChange(...args)
}))

jest.mock('../../../context/ModalContext', () => ({
  useModal: () => ({
    closeModal: mockCloseModal
  })
}))

jest.mock('../../../utils/logger', () => ({
  logger: {
    error: (...args) => mockLoggerError(...args)
  }
}))

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn()
  }
}))

const renderWithProviders = (ui) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

describe('ModifyVaultModalContentV2', () => {
  const isVaultProtected = jest.fn()
  const updateProtectedVault = jest.fn()
  const updateUnprotectedVault = jest.fn()
  const refetchVault = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseVault.mockReturnValue({
      isVaultProtected,
      updateProtectedVault,
      updateUnprotectedVault,
      refetch: refetchVault
    })

    mockValidatePasswordChange.mockReturnValue({
      success: true
    })
  })

  it('renames an unprotected vault and closes the modal', async () => {
    isVaultProtected.mockResolvedValue(false)
    updateUnprotectedVault.mockResolvedValue(undefined)
    refetchVault.mockResolvedValue(undefined)
    const onSuccess = jest.fn()

    const { getByTestId } = renderWithProviders(
      <ModifyVaultModalContentV2
        vaultId="vault-1"
        vaultName="Personal Vault"
        action={VAULT_ACTION.NAME}
        onSuccess={onSuccess}
      />
    )

    fireEvent.changeText(
      getByTestId('modify-vault-modal-v2-name-input'),
      'Renamed Vault'
    )
    fireEvent.press(getByTestId('modify-vault-modal-v2-save-button'))

    await waitFor(() =>
      expect(updateUnprotectedVault).toHaveBeenCalledWith('vault-1', {
        name: 'Renamed Vault',
        password: undefined
      })
    )

    expect(refetchVault).toHaveBeenCalledWith('vault-1')
    expect(onSuccess).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text1: 'Vault renamed'
      })
    )
  })

  it('updates the password for a protected vault', async () => {
    isVaultProtected.mockResolvedValue(true)
    updateProtectedVault.mockResolvedValue(undefined)
    refetchVault.mockResolvedValue(undefined)

    const { getByTestId } = renderWithProviders(
      <ModifyVaultModalContentV2
        vaultId="vault-1"
        vaultName="Personal Vault"
        action={VAULT_ACTION.PASSWORD}
      />
    )

    await waitFor(() =>
      expect(
        getByTestId('modify-vault-modal-v2-current-password-input')
      ).toBeTruthy()
    )

    fireEvent.changeText(
      getByTestId('modify-vault-modal-v2-current-password-input'),
      'Current#2026'
    )
    fireEvent.changeText(
      getByTestId('modify-vault-modal-v2-new-password-input'),
      'Strong#2026'
    )
    fireEvent.changeText(
      getByTestId('modify-vault-modal-v2-repeat-password-input'),
      'Strong#2026'
    )
    fireEvent.press(getByTestId('modify-vault-modal-v2-save-button'))

    await waitFor(() =>
      expect(updateProtectedVault).toHaveBeenCalledWith('vault-1', {
        name: 'Personal Vault',
        password: 'Strong#2026',
        currentPassword: 'Current#2026'
      })
    )

    expect(mockValidatePasswordChange).toHaveBeenCalled()
    expect(mockCloseModal).toHaveBeenCalled()
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text1: 'Vault password updated'
      })
    )
  })

  it('shows a validation error and blocks password submission when validation fails', async () => {
    isVaultProtected.mockResolvedValue(false)
    mockValidatePasswordChange.mockReturnValue({
      success: false,
      field: 'repeatPassword',
      error: 'Passwords do not match'
    })

    const { getByTestId, findByText } = renderWithProviders(
      <ModifyVaultModalContentV2
        vaultId="vault-1"
        vaultName="Personal Vault"
        action={VAULT_ACTION.PASSWORD}
      />
    )

    fireEvent.changeText(
      getByTestId('modify-vault-modal-v2-new-password-input'),
      'Strong#2026'
    )
    fireEvent.changeText(
      getByTestId('modify-vault-modal-v2-repeat-password-input'),
      'Mismatch#2026'
    )
    fireEvent.press(getByTestId('modify-vault-modal-v2-save-button'))

    expect(await findByText('Passwords do not match')).toBeTruthy()
    expect(updateUnprotectedVault).not.toHaveBeenCalled()
    expect(mockCloseModal).not.toHaveBeenCalled()
  })

  it('cancels without saving', () => {
    isVaultProtected.mockResolvedValue(false)

    const { getByTestId } = renderWithProviders(
      <ModifyVaultModalContentV2
        vaultId="vault-1"
        vaultName="Personal Vault"
        action={VAULT_ACTION.NAME}
      />
    )

    fireEvent.press(getByTestId('modify-vault-modal-v2-cancel-button'))

    expect(mockCloseModal).toHaveBeenCalled()
    expect(updateUnprotectedVault).not.toHaveBeenCalled()
  })
})
