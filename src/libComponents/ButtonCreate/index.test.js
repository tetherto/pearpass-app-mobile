import { render, fireEvent } from '@testing-library/react-native'
import { ArrowDownIcon } from 'pearpass-lib-ui-react-native-components'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { ButtonCreate } from './index'

const DummyIcon = (props) => <ArrowDownIcon {...props} testID="dummy-icon" />

describe('ButtonCreate Component', () => {
  test('renders children and triggers onPress event', () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ThemeProvider>
        <ButtonCreate onPress={onPressMock}>Create</ButtonCreate>
      </ThemeProvider>
    )

    const buttonText = getByText('Create')
    expect(buttonText).toBeTruthy()

    fireEvent.press(buttonText)
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  test('renders startIcon when provided', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonCreate onPress={onPressMock} startIcon={DummyIcon}>
          Create
        </ButtonCreate>
      </ThemeProvider>
    )

    const icon = getByTestId('dummy-icon')
    expect(icon).toBeTruthy()

    expect(icon.props.width).toBe('21')
  })

  test('matches snapshot', () => {
    const onPressMock = jest.fn()
    const { toJSON } = render(
      <ThemeProvider>
        <ButtonCreate onPress={onPressMock} startIcon={DummyIcon}>
          Create
        </ButtonCreate>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native button', () => {
    const onPressMock = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider>
        <ButtonCreate testID="button-create" onPress={onPressMock}>
          Create
        </ButtonCreate>
      </ThemeProvider>
    )
    expect(getByTestId('button-create')).toBeTruthy()
  })
})
