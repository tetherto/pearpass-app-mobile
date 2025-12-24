import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { ButtonSecondary } from './index'

describe('ButtonSecondary Component', () => {
  test('renders children correctly', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonSecondary onPress={onPressMock} stretch={false}>
          Secondary Button
        </ButtonSecondary>
      </ThemeProvider>
    )
    expect(getByText('Secondary Button')).toBeTruthy()
  })

  test('triggers onPress when pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonSecondary onPress={onPressMock} stretch={false}>
          Secondary Button
        </ButtonSecondary>
      </ThemeProvider>
    )
    const buttonText = getByText('Secondary Button')
    fireEvent.press(buttonText)
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  test('matches snapshot', () => {
    const onPressMock = jest.fn()
    const { toJSON } = render(
      <ThemeProvider>
        <ButtonSecondary onPress={onPressMock} stretch size="md">
          Secondary Button
        </ButtonSecondary>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native button', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonSecondary testID="button-secondary" onPress={onPressMock} stretch={false}>
          Secondary Button
        </ButtonSecondary>
      </ThemeProvider>
    )
    expect(getByTestId('button-secondary')).toBeTruthy()
  })
})
