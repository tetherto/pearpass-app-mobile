import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { AppWarning } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => {
  const { Text } = require('react-native')

  return {
    YellowErrorIcon: () => <Text testID="yellow-error-icon">Icon</Text>
  }
})

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('AppWarning', () => {
  it('renders correctly with default styles', () => {
    const { getByTestId, toJSON, getByText } = renderWithProviders(
      <AppWarning warning="Test warning" />
    )

    expect(getByTestId('yellow-error-icon')).toBeTruthy()
    expect(getByText('Test warning')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly with custom container and text styles', () => {
    const containerStyles = { marginBottom: 15 }
    const textStyles = { flex: 0 }

    const { toJSON, getByText } = renderWithProviders(
      <AppWarning
        warning="Styled warning"
        containerStyles={containerStyles}
        textStyles={textStyles}
      />
    )

    expect(getByText('Styled warning')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})
