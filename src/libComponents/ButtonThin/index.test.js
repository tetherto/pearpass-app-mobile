import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider, colors } from 'pearpass-lib-ui-theme-provider/native'
import { Text } from 'react-native'

import { ButtonThin } from './index'

const DummyIcon = (props) => (
  <Text testID="dummy-icon">{`Icon ${props.size} ${props.color}`}</Text>
)

describe('ButtonThin Component', () => {
  test('renders children and triggers onPress event', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonThin onPress={onPressMock}>Thin Button</ButtonThin>
      </ThemeProvider>
    )

    const buttonText = getByText('Thin Button')
    expect(buttonText).toBeTruthy()

    fireEvent.press(buttonText)
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  test('renders startIcon when provided with correct props', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonThin onPress={onPressMock} startIcon={DummyIcon}>
          Thin Button
        </ButtonThin>
      </ThemeProvider>
    )

    const icon = getByTestId('dummy-icon')
    expect(icon).toBeTruthy()

    expect(icon.props.children).toContain('Icon 21')
    expect(icon.props.children).toContain(colors.primary400.mode1)
  })

  test('matches snapshot', () => {
    const onPressMock = jest.fn()
    const { toJSON } = render(
      <ThemeProvider>
        <ButtonThin onPress={onPressMock} startIcon={DummyIcon}>
          Thin Button
        </ButtonThin>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native button', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonThin testID="button-thin" onPress={onPressMock}>
          Thin Button
        </ButtonThin>
      </ThemeProvider>
    )
    expect(getByTestId('button-thin')).toBeTruthy()
  })
})
