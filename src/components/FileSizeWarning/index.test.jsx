import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render } from '@testing-library/react-native'
import { ThemeProvider } from 'styled-components/native'

import { FileSizeWarning } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@tetherto/pearpass-lib-constants', () => ({
  MAX_FILE_SIZE_MB: 6
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

const theme = {
  colors: {
    white: {
      mode1: '#ffffff'
    }
  }
}

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('FileSizeWarning', () => {
  it('renders default maximum file size text when no warning', () => {
    const { getByText, queryByTestId } = renderWithProviders(
      <FileSizeWarning isFileSizeWarning={false} />
    )

    expect(getByText(`Maximum file size: 6 MB.`)).toBeTruthy()

    expect(queryByTestId('YellowErrorIcon')).toBeNull()
  })

  it('renders warning text when file is too large', () => {
    const { getByText } = renderWithProviders(
      <FileSizeWarning isFileSizeWarning />
    )

    expect(getByText(/Your file is too large/)).toBeTruthy()
    expect(getByText(/6 MB or smaller/)).toBeTruthy()
  })
})
