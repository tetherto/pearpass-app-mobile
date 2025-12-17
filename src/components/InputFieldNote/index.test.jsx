import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { InputFieldNote } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (text) => text
  })
}))

jest.mock('pearpass-lib-ui-react-native-components', () => ({
  CommonFileIcon: () => 'CommonFileIcon'
}))

jest.mock('../../libComponents', () => ({
  InputField: ({ label, placeholder, variant, icon, ...props }) => (
    <div
      testID="input-field"
      data-testid="input-field"
      data-label={label}
      data-placeholder={placeholder}
      data-variant={variant}
      {...props}
    >
      {icon && <div data-testid="icon">{icon()}</div>}
    </div>
  )
}))

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('InputFieldNote component', () => {
  test('renders correctly with default props', () => {
    const { getByTestId, toJSON } = renderWithProviders(<InputFieldNote />)

    const inputField = getByTestId('input-field')
    expect(inputField).toBeTruthy()
    expect(inputField.props['data-label']).toBe('Comment')
    expect(inputField.props['data-placeholder']).toBe('Add comment')
    expect(inputField.props['data-variant']).toBe('outline')
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes additional props to InputField', () => {
    const onChangeText = jest.fn()
    const { getByTestId } = renderWithProviders(
      <InputFieldNote
        value="Test comment"
        onChangeText={onChangeText}
        testID="custom-test-id"
      />
    )

    const inputField = getByTestId('custom-test-id')
    expect(inputField.props.value).toBe('Test comment')
    expect(inputField.props.testID).toBe('custom-test-id')

    fireEvent(inputField, 'changeText', 'New comment')
    expect(onChangeText).toHaveBeenCalledWith('New comment')
  })

  test('renders with custom style prop', () => {
    const customStyle = { margin: 10 }
    const { getByTestId } = renderWithProviders(
      <InputFieldNote style={customStyle} />
    )

    const inputField = getByTestId('input-field')
    expect(inputField.props.style).toEqual(customStyle)
  })
})
