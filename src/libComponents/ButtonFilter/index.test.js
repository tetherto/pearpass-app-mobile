import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider, colors } from 'pearpass-lib-ui-theme-provider/native'
import { Text } from 'react-native'

import { ButtonFilter } from './index'

const DummyIcon = (props) => (
  <Text testID="dummy-icon">{`Icon ${props.size} ${props.color}`}</Text>
)

describe('ButtonFilter Component', () => {
  test('renders children and triggers onPress event', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonFilter onPress={onPressMock}>Filter Me</ButtonFilter>
      </ThemeProvider>
    )

    const buttonText = getByText('Filter Me')
    expect(buttonText).toBeTruthy()

    fireEvent.press(buttonText)
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  test('renders startIcon with primary variant', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonFilter
          onPress={onPressMock}
          startIcon={DummyIcon}
          variant="primary"
        >
          Filter Me
        </ButtonFilter>
      </ThemeProvider>
    )

    const icon = getByTestId('dummy-icon')
    expect(icon).toBeTruthy()

    expect(icon.props.children).toContain('Icon 21')
    expect(icon.props.children).toContain(colors.secondary400.mode1)
  })

  test('renders startIcon with non-primary variant', () => {
    const onPressMock = jest.fn()

    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonFilter
          onPress={onPressMock}
          startIcon={DummyIcon}
          variant="secondary"
        >
          Filter Me
        </ButtonFilter>
      </ThemeProvider>
    )

    const icon = getByTestId('dummy-icon')
    expect(icon).toBeTruthy()

    expect(icon.props.children).toContain('Icon 21')
    expect(icon.props.children).toContain(colors.white.mode1)
  })

  test('matches snapshot for primary variant', () => {
    const onPressMock = jest.fn()
    const { toJSON } = render(
      <ThemeProvider>
        <ButtonFilter
          onPress={onPressMock}
          startIcon={DummyIcon}
          variant="primary"
        >
          Filter Me
        </ButtonFilter>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native button', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonFilter testID="button-filter" onPress={onPressMock}>
          Filter Me
        </ButtonFilter>
      </ThemeProvider>
    )
    expect(getByTestId('button-filter')).toBeTruthy()
  })
})
