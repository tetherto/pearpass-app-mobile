import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { ButtonPrimary } from './index'

describe('ButtonPrimary Component', () => {
  test('renders children correctly', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonPrimary onPress={onPressMock} stretch={false}>
          Primary Button
        </ButtonPrimary>
      </ThemeProvider>
    )
    expect(getByText('Primary Button')).toBeTruthy()
  })

  test('triggers onPress when pressed and not disabled', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonPrimary onPress={onPressMock} stretch={false}>
          Primary Button
        </ButtonPrimary>
      </ThemeProvider>
    )
    const buttonText = getByText('Primary Button')
    fireEvent.press(buttonText)
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  test('does not trigger onPress when disabled', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonPrimary onPress={onPressMock} stretch={false} disabled>
          Primary Button
        </ButtonPrimary>
      </ThemeProvider>
    )
    const buttonText = getByText('Primary Button')
    fireEvent.press(buttonText)
    expect(onPressMock).not.toHaveBeenCalled()
  })

  test('matches snapshot for a small, stretched button', () => {
    const onPressMock = jest.fn()
    const { toJSON } = render(
      <ThemeProvider>
        <ButtonPrimary onPress={onPressMock} stretch size="sm">
          Primary Button
        </ButtonPrimary>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native button', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonPrimary testID="primary-btn" onPress={onPressMock} stretch={false}>
          Primary Button
        </ButtonPrimary>
      </ThemeProvider>
    )
    expect(getByTestId('primary-btn')).toBeTruthy()
  })
})
