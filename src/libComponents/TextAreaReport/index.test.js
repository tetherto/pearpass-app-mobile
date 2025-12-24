import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import { TouchableOpacity } from 'react-native'

import { TextAreaReport } from './index'

describe('TextAreaReport Component', () => {
  test('renders with correct placeholder and value', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <ThemeProvider>
        <TextAreaReport
          value="initial value"
          placeholder="Enter report text"
          onChange={() => {}}
          isDisabled={false}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    expect(getByPlaceholderText('Enter report text')).toBeTruthy()
    expect(getByDisplayValue('initial value')).toBeTruthy()
  })

  test('calls onChange when text changes and not disabled', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <TextAreaReport
          value=""
          placeholder="Enter report text"
          onChange={onChangeMock}
          isDisabled={false}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    const textInput = getByPlaceholderText('Enter report text')
    fireEvent.changeText(textInput, 'new report text')
    expect(onChangeMock).toHaveBeenCalledWith('new report text')
  })

  test('does not call onChange when disabled', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <TextAreaReport
          value=""
          placeholder="Enter report text"
          onChange={onChangeMock}
          isDisabled={true}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    const textInput = getByPlaceholderText('Enter report text')
    fireEvent.changeText(textInput, 'attempted text')
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  test('calls onClick when the outer container is pressed', () => {
    const onClickMock = jest.fn()
    const { UNSAFE_getByType } = render(
      <ThemeProvider>
        <TextAreaReport
          value="some value"
          placeholder="Enter report text"
          onChange={() => {}}
          isDisabled={false}
          onClick={onClickMock}
        />
      </ThemeProvider>
    )
    const touchable = UNSAFE_getByType(TouchableOpacity)
    fireEvent.press(touchable)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test('matches snapshot', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <TextAreaReport
          value="snapshot value"
          placeholder="Enter report text"
          onChange={() => {}}
          isDisabled={false}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native component', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TextAreaReport
          testID="text-area-report"
          value="test"
          placeholder="Enter report text"
          onChange={() => {}}
          isDisabled={false}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    expect(getByTestId('text-area-report')).toBeTruthy()
  })
})
