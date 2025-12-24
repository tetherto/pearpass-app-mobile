import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import { TouchableOpacity } from 'react-native'

import { TextArea } from './index'

describe('TextArea Component', () => {
  test('renders with correct placeholder and value', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <ThemeProvider>
        <TextArea
          value="test value"
          placeholder="Enter text"
          onChange={() => {}}
          isDisabled={false}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    expect(getByPlaceholderText('Enter text')).toBeTruthy()
    expect(getByDisplayValue('test value')).toBeTruthy()
  })

  test('calls onChange when text changes if not disabled', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <TextArea
          value=""
          placeholder="Enter text"
          onChange={onChangeMock}
          isDisabled={false}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter text')
    fireEvent.changeText(input, 'new text')
    expect(onChangeMock).toHaveBeenCalledWith('new text')
  })

  test('does not call onChange when disabled', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <TextArea
          value=""
          placeholder="Enter text"
          onChange={onChangeMock}
          isDisabled={true}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter text')
    fireEvent.changeText(input, 'new text')
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  test('calls onClick when the outer container is pressed', () => {
    const onClickMock = jest.fn()
    const { UNSAFE_getByType } = render(
      <ThemeProvider>
        <TextArea
          value="sample"
          placeholder="Enter text"
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
        <TextArea
          value="snapshot text"
          placeholder="Enter text"
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
        <TextArea
          testID="text-area"
          value="test"
          placeholder="Enter text"
          onChange={() => {}}
          isDisabled={false}
          onClick={() => {}}
        />
      </ThemeProvider>
    )
    expect(getByTestId('text-area')).toBeTruthy()
  })
})
