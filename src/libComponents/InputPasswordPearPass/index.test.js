import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { InputPasswordPearPass } from './index'
import { ButtonLittle } from '../ButtonLittle'

describe('InputPasswordPearPass Component', () => {
  test('renders placeholder and value correctly', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(
      <ThemeProvider>
        <InputPasswordPearPass
          value="secret"
          placeholder="Enter password"
          isPassword={true}
        />
      </ThemeProvider>
    )
    expect(getByPlaceholderText('Enter password')).toBeTruthy()
    expect(getByDisplayValue('secret')).toBeTruthy()
  })

  test('calls onChange when text changes', () => {
    const onChangeMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <InputPasswordPearPass
          value=""
          placeholder="Enter password"
          onChange={onChangeMock}
          isPassword={true}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent.changeText(input, 'newSecret')
    expect(onChangeMock).toHaveBeenCalledWith('newSecret')
  })

  test('renders error message when provided', () => {
    const { getByText } = render(
      <ThemeProvider>
        <InputPasswordPearPass
          value="secret"
          placeholder="Enter password"
          error="Invalid password"
          isPassword={true}
        />
      </ThemeProvider>
    )
    expect(getByText('Invalid password')).toBeTruthy()
  })

  test('triggers onClick when container is pressed', () => {
    const onClickMock = jest.fn()
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <InputPasswordPearPass
          value="secret"
          placeholder="Enter password"
          onClick={onClickMock}
          isPassword={true}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter password')
    fireEvent.press(input)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  test('toggles secure text entry when toggle button is pressed', () => {
    const { getByPlaceholderText, UNSAFE_getByType } = render(
      <ThemeProvider>
        <InputPasswordPearPass
          value="secret"
          placeholder="Enter password"
          isPassword={true}
        />
      </ThemeProvider>
    )
    const input = getByPlaceholderText('Enter password')
    expect(input.props.secureTextEntry).toBe(true)

    const toggleButton = UNSAFE_getByType(ButtonLittle)
    expect(toggleButton).toBeTruthy()

    fireEvent.press(toggleButton)
    expect(input.props.secureTextEntry).toBe(false)

    fireEvent.press(toggleButton)
    expect(input.props.secureTextEntry).toBe(true)
  })

  test('matches snapshot', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <InputPasswordPearPass
          value="snapshot"
          placeholder="Enter password"
          error="Error"
          isPassword={true}
        />
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native input', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <InputPasswordPearPass
          testID="password-input"
          value="test"
          placeholder="Enter password"
          isPassword={true}
        />
      </ThemeProvider>
    )
    expect(getByTestId('password-input')).toBeTruthy()
  })
})
