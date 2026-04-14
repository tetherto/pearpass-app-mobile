import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, renderHook, waitFor } from '@testing-library/react-native'

import { usePasswordCreation } from './usePasswordCreation'
import messages from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockCreateMasterPassword = jest.fn()
const mockLogIn = jest.fn()
const mockInitVaults = jest.fn()
const mockCreateVault = jest.fn()
const mockAddDevice = jest.fn()
const mockClearBuffer = jest.fn()

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

      const setValue = (name, value) => {
        setValues((current) => ({ ...current, [name]: value }))
      }

      const setErrors = (nextErrors) => {
        if (typeof nextErrors === 'function') {
          setErrorsState((current) => nextErrors(current))
          return
        }

        setErrorsState((current) => ({ ...current, ...nextErrors }))
      }

      const handleSubmit = (onSubmit) => async () => {
        const validationErrors = validate?.(values) || {}

        if (Object.keys(validationErrors).length > 0) {
          setErrorsState(validationErrors)
          return
        }

        await onSubmit(values)
      }

      return {
        register,
        handleSubmit,
        setErrors,
        setValue,
        values
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

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useCreateVault: () => ({
    createVault: mockCreateVault
  }),
  useUserData: () => ({
    createMasterPassword: mockCreateMasterPassword,
    logIn: mockLogIn
  }),
  useVault: () => ({
    addDevice: mockAddDevice
  }),
  useVaults: () => ({
    initVaults: mockInitVaults
  })
}))

jest.mock('@tetherto/pearpass-lib-vault/src/utils/buffer', () => ({
  clearBuffer: (...args) => mockClearBuffer(...args),
  stringToBuffer: (value) => `buffer:${value}`
}))

jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

jest.mock('../../../utils/passwordPolicy', () => ({
  getPasswordIndicatorVariant: () => 'strong',
  getPasswordValidationMessages: () => ({
    minLength: 'min length',
    hasLowerCase: 'lowercase',
    hasUpperCase: 'uppercase',
    hasNumbers: 'number',
    hasSymbols: 'symbol'
  }),
  getPasswordsMatch: (password, confirmPassword) =>
    password === confirmPassword,
  getPasswordStrengthMeta: () => ({
    result: {
      success: true
    }
  })
}))

const wrapper = ({ children }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
)

describe('usePasswordCreation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLogIn.mockResolvedValue(undefined)
    mockInitVaults.mockResolvedValue(undefined)
    mockCreateVault.mockResolvedValue(undefined)
    mockAddDevice.mockResolvedValue(undefined)
  })

  it('prevents duplicate master password creation requests while one is in flight', async () => {
    let resolveCreate
    mockCreateMasterPassword.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve
        })
    )

    const { result } = renderHook(() => usePasswordCreation(), { wrapper })

    act(() => {
      result.current.handlePasswordChange('Master#2026')
      result.current.handlePasswordConfirmChange('Master#2026')
    })

    await act(async () => {
      const firstSubmit = result.current.submit()
      const secondSubmit = result.current.submit()

      await waitFor(() =>
        expect(mockCreateMasterPassword).toHaveBeenCalledTimes(1)
      )

      resolveCreate()
      await Promise.all([firstSubmit, secondSubmit])
    })

    expect(mockLogIn).toHaveBeenCalledTimes(1)
    expect(mockInitVaults).toHaveBeenCalledTimes(1)
    expect(mockCreateVault).toHaveBeenCalledTimes(1)
    expect(mockAddDevice).toHaveBeenCalledTimes(1)
  })
})
