import { fireEvent, render, waitFor } from '@testing-library/react-native'

import { MultiSelectDelete } from './index'

const mockGoBack = jest.fn()
const mockUpdateRecords = jest.fn()
const mockDeleteRecords = jest.fn()
const mockToastShow = jest.fn()
const mockOnComplete = jest.fn()
const mockParams = {}

jest.mock('@lingui/react', () => {
  const translate = (msg) =>
    msg && typeof msg === 'object' ? (msg.message ?? msg.id ?? '') : String(msg)
  return {
    useLingui: () => ({ t: translate, _: translate }),
    I18nProvider: ({ children }) => children
  }
})

jest.mock('@lingui/react/macro', () => {
  const translate = (msg) =>
    msg && typeof msg === 'object' ? (msg.message ?? msg.id ?? '') : String(msg)
  return { useLingui: () => ({ t: translate, _: translate }) }
})

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: mockParams })
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useRecords: () => ({
    deleteRecords: mockDeleteRecords,
    updateRecords: mockUpdateRecords
  })
}))

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: { show: (...args) => mockToastShow(...args) }
}))

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const React = require('react')
  const { TouchableOpacity, Text } = require('react-native')
  return {
    Button: ({ children, onClick }) =>
      React.createElement(
        TouchableOpacity,
        { testID: 'action-button', onPress: onClick },
        React.createElement(Text, null, children)
      ),
    ListItem: () => null,
    Text: ({ children, style }) =>
      React.createElement(Text, { style }, children),
    useTheme: () => ({
      theme: {
        colors: { colorSurfacePrimary: '#fff', colorTextSecondary: '#666' }
      }
    })
  }
})

jest.mock('../../containers/Layout', () => {
  const React = require('react')
  const { View } = require('react-native')
  return {
    Layout: ({ children, header, footer }) =>
      React.createElement(View, null, header, children, footer)
  }
})

jest.mock('../../containers/ScreenHeader/BackScreenHeader', () => {
  const React = require('react')
  const { View, Text, TouchableOpacity } = require('react-native')
  return {
    BackScreenHeader: ({ title, onBack }) =>
      React.createElement(
        View,
        null,
        React.createElement(Text, null, title),
        React.createElement(
          TouchableOpacity,
          { onPress: onBack },
          React.createElement(Text, null, 'Back')
        )
      )
  }
})

jest.mock('../../components/FadeGradient', () => ({
  FadeGradient: () => null
}))

jest.mock('../../components/RecordItemIcon', () => ({
  RecordItemIcon: () => null
}))

jest.mock('../../utils/getRecordSubtitle', () => ({
  getRecordSubtitle: () => ''
}))

jest.mock('./styles', () => ({
  createStyles: () => ({
    container: {},
    recordsSection: {},
    sectionLabel: {},
    recordsScroll: {},
    recordsContent: {},
    recordItem: {},
    fadeGradient: {},
    confirmText: {}
  })
}))

const loginRecordWithOtp = {
  id: 'login-1',
  type: 'login',
  folder: 'Work',
  isFavorite: false,
  data: {
    title: 'My Service',
    username: 'user@example.com',
    password: 'hunter2',
    otpInput: 'test-otp-secret',
    otp: { secret: 'test-otp-secret', type: 'totp', period: 30 }
  },
  otpPublic: { currentCode: '123456', timeRemaining: 25 }
}

describe('MultiSelectDelete — strip OTP path', () => {
  beforeEach(() => {
    mockGoBack.mockClear()
    mockUpdateRecords.mockClear()
    mockDeleteRecords.mockClear()
    mockToastShow.mockClear()
    mockOnComplete.mockClear()

    Object.assign(mockParams, {
      selectedRecordIds: ['login-1'],
      selectedRecordObjects: [loginRecordWithOtp],
      onComplete: mockOnComplete,
      isOtpContext: true
    })
  })

  it('calls updateRecords with otpInput and otp stripped, not deleteRecords', async () => {
    mockUpdateRecords.mockResolvedValue(undefined)

    const { getByTestId } = render(<MultiSelectDelete />)
    fireEvent.press(getByTestId('action-button'))

    await waitFor(() => {
      expect(mockUpdateRecords).toHaveBeenCalledTimes(1)
    })

    expect(mockDeleteRecords).not.toHaveBeenCalled()

    const [records] = mockUpdateRecords.mock.calls[0]
    const updated = records[0]

    expect(updated.data.otpInput).toBeUndefined()
    expect(updated.data.otp).toBeUndefined()
    expect(updated.data.username).toBe('user@example.com')
    expect(updated.otpPublic).toBeUndefined()
  })

  it('shows a toast with the error message when updateRecords rejects', async () => {
    const error = new Error('Vault is locked')
    mockUpdateRecords.mockRejectedValue(error)

    const { getByTestId } = render(<MultiSelectDelete />)
    fireEvent.press(getByTestId('action-button'))

    await waitFor(() => {
      expect(mockToastShow).toHaveBeenCalledWith(
        expect.objectContaining({ text1: 'Vault is locked' })
      )
    })

    expect(mockGoBack).not.toHaveBeenCalled()
  })

  it('falls through to deleteRecords when isOtpContext is false', async () => {
    mockDeleteRecords.mockResolvedValue(undefined)
    Object.assign(mockParams, { isOtpContext: false })

    const { getByTestId } = render(<MultiSelectDelete />)
    fireEvent.press(getByTestId('action-button'))

    await waitFor(() => {
      expect(mockDeleteRecords).toHaveBeenCalledWith(['login-1'])
    })

    expect(mockUpdateRecords).not.toHaveBeenCalled()
  })
})
