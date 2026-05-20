import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { fireEvent, render } from '@testing-library/react-native'

import { AccessRemovedModalContent } from './index'
import { useModal } from '../../../context/ModalContext'
import messages from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('../../../context/ModalContext', () => ({
  useModal: jest.fn()
}))

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const { View, Text: RNText, Pressable } = require('react-native')
  return {
    rawTokens: new Proxy({}, { get: () => 0 }),
    useTheme: () => ({
      theme: {
        colors: {
          colorSurfacePrimary: '#fff',
          colorBorderPrimary: '#000'
        }
      }
    }),
    PageHeader: ({ title, testID }) => (
      <View testID={testID}>
        <RNText>{title}</RNText>
      </View>
    ),
    Text: ({ children, testID }) => <RNText testID={testID}>{children}</RNText>,
    Button: ({ children, onClick, testID }) => (
      <Pressable testID={testID} onPress={onClick}>
        <RNText>{children}</RNText>
      </Pressable>
    )
  }
})

const renderModal = (props) =>
  render(<AccessRemovedModalContent {...props} />, {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    )
  })

describe('AccessRemovedModalContent', () => {
  const closeModal = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useModal.mockReturnValue({ closeModal })
  })

  it('renders without a deviceName', () => {
    const api = renderModal({ vaultName: 'V1' })
    const lead = api.getByTestId('access-removed-modal-lead')
    expect(lead).toBeTruthy()
  })

  it('renders with a deviceName', () => {
    const api = renderModal({ vaultName: 'V1', deviceName: 'ios arm64' })
    const lead = api.getByTestId('access-removed-modal-lead')
    expect(lead).toBeTruthy()
  })

  it('calls closeModal when Understood is pressed', () => {
    const api = renderModal({ vaultName: 'V1' })
    fireEvent.press(api.getByTestId('access-removed-modal-understood-button'))
    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
