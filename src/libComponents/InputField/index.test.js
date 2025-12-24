import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import { Text } from 'react-native'

import { InputField } from './index'

describe('InputField Component', () => {
  test('renders label, placeholder, and value correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <ThemeProvider>
        <InputField
          value="test value"
          label="Test Label"
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
        />
      </ThemeProvider>
    )
    expect(getByText('Test Label')).toBeTruthy()
    expect(getByPlaceholderText('Enter value')).toBeTruthy()
  })

  test('calls onChange when text changes', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <InputField
          value=""
          onChange={onChangeMock}
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter value')
    fireEvent.changeText(input, 'new value')
    expect(onChangeMock).toHaveBeenCalledWith('new value')
  })

  test('triggers onFocus and onBlur events', () => {
    const onFocusMock = jest.fn()
    const onBlurMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <InputField
          value=""
          onFocus={onFocusMock}
          onBlur={onBlurMock}
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter value')
    fireEvent(input, 'focus')
    expect(onFocusMock).toHaveBeenCalledTimes(1)
    fireEvent(input, 'blur')
    expect(onBlurMock).toHaveBeenCalledTimes(1)
  })

  test('calls onClick when outer container is pressed', () => {
    const onClickMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <InputField
          value="click test"
          onClick={onClickMock}
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter value')
    fireEvent.press(input)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test('renders error message when provided', () => {
    const { getByText } = render(
      <ThemeProvider>
        <InputField
          value="test value"
          error="Error message"
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
        />
      </ThemeProvider>
    )
    expect(getByText('Error message')).toBeTruthy()
  })

  test('renders highlighted text when isColored is true', () => {
    const { getByText } = render(
      <ThemeProvider>
        <InputField
          value="colored text"
          isColored={true}
          placeholder="Enter value"
          isSecure={false}
        />
      </ThemeProvider>
    )
    expect(getByText('colored text')).toBeTruthy()
  })

  test('renders belowInputContent when provided', () => {
    const BelowContent = () => <Text testID="below-content">Below content</Text>
    const { getByTestId } = render(
      <ThemeProvider>
        <InputField
          value="test value"
          label="Test Label"
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
          belowInputContent={<BelowContent />}
        />
      </ThemeProvider>
    )
    expect(getByTestId('below-content')).toBeTruthy()
  })

  test('does not render belowInputContent when not provided', () => {
    const { queryByTestId } = render(
      <ThemeProvider>
        <InputField
          value="test value"
          label="Test Label"
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
        />
      </ThemeProvider>
    )
    expect(queryByTestId('below-content')).toBeNull()
  })

  test('matches snapshot', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <InputField
          value="snapshot value"
          label="Snapshot Label"
          error="Snapshot error"
          placeholder="Enter snapshot"
          isSecure={true}
          isColored={true}
        />
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to TextInput', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <InputField
          testID="input-field"
          value=""
          placeholder="Enter value"
          isSecure={false}
          isColored={false}
        />
      </ThemeProvider>
    )
    expect(getByTestId('input-field')).toBeTruthy()
  })
})
