import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider, colors } from 'pearpass-lib-ui-theme-provider/native'
import { Text } from 'react-native'

import { ButtonLittle } from './index'

const DummyIcon = (props) => (
  <Text testID="dummy-icon">{`Icon ${props.size} ${props.color}`}</Text>
)

describe('ButtonLittle Component', () => {
  test('renders children and triggers onPress event', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonLittle onPress={onPressMock}>Little Button</ButtonLittle>
      </ThemeProvider>
    )

    const buttonText = getByText('Little Button')
    expect(buttonText).toBeTruthy()

    fireEvent.press(buttonText)
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  test('renders startIcon with primary variant', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonLittle
          onPress={onPressMock}
          startIcon={DummyIcon}
          variant="primary"
        >
          Little Button
        </ButtonLittle>
      </ThemeProvider>
    )

    const icon = getByTestId('dummy-icon')
    expect(icon).toBeTruthy()
    expect(icon.props.children).toContain('Icon 21')
    expect(icon.props.children).toContain(colors.black.mode1)
  })

  test('renders startIcon with non-primary variant', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonLittle
          onPress={onPressMock}
          startIcon={DummyIcon}
          variant="secondary"
        >
          Little Button
        </ButtonLittle>
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
        <ButtonLittle
          onPress={onPressMock}
          startIcon={DummyIcon}
          variant="primary"
        >
          Little Button
        </ButtonLittle>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native button', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonLittle testID="button-little" onPress={onPressMock}>
          Little Button
        </ButtonLittle>
      </ThemeProvider>
    )
    expect(getByTestId('button-little')).toBeTruthy()
  })
})
