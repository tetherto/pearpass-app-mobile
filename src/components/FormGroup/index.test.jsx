import { render, fireEvent } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { View, Text } from 'react-native'

import { FormGroup } from './index'

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  ArrowDownIcon: () => 'ArrowDownIcon',
  ArrowUpIcon: () => 'ArrowUpIcon'
}))

const TestChild = ({ isFirst, isLast, index, focusedIndex, onFocus }) => (
  <View testID={`child-${index}`}>
    <Text>Child {index}</Text>
    <Text testID="first-prop">{isFirst ? 'first' : 'not-first'}</Text>
    <Text testID="last-prop">{isLast ? 'last' : 'not-last'}</Text>
    <Text testID="focused">
      {focusedIndex === index ? 'focused' : 'not-focused'}
    </Text>
    <View testID="focus-trigger" onFocus={onFocus} />
  </View>
)

const renderWithProviders = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('FormGroup component', () => {
  test('renders children correctly', () => {
    const { getAllByText, getByText, toJSON } = renderWithProviders(
      <FormGroup>
        <TestChild />
        <TestChild />
        <TestChild />
      </FormGroup>
    )

    expect(getAllByText(/Child/)).toHaveLength(3)
    expect(getByText('first')).toBeTruthy()
    expect(getByText('last')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  test('shows title when provided with isCollapse=true', () => {
    const { getByText } = renderWithProviders(
      <FormGroup title="Test Group" isCollapse={true}>
        <TestChild />
      </FormGroup>
    )

    expect(getByText('Test Group')).toBeTruthy()
  })

  test('does not show title when isCollapse=false', () => {
    const { queryByText } = renderWithProviders(
      <FormGroup title="Test Group" isCollapse={false}>
        <TestChild />
      </FormGroup>
    )

    expect(queryByText('Test Group')).toBeNull()
  })

  test('toggles open/close state when title is pressed', () => {
    const { getByText, queryByText } = renderWithProviders(
      <FormGroup title="Test Group" isCollapse={true}>
        <TestChild />
      </FormGroup>
    )

    expect(queryByText('Child 0')).toBeTruthy()

    fireEvent.press(getByText('Test Group'))

    expect(queryByText('Child 0')).toBeNull()

    fireEvent.press(getByText('Test Group'))

    expect(queryByText('Child 0')).toBeTruthy()
  })

  test('sets focus correctly', () => {
    const { getAllByTestId } = renderWithProviders(
      <FormGroup>
        <TestChild />
        <TestChild />
        <TestChild />
      </FormGroup>
    )

    const focusTriggers = getAllByTestId('focus-trigger')
    const focusedTexts = getAllByTestId('focused')

    expect(focusedTexts[0].props.children).toBe('not-focused')
    expect(focusedTexts[1].props.children).toBe('not-focused')

    fireEvent(focusTriggers[1], 'focus')

    expect(focusedTexts[0].props.children).toBe('not-focused')
    expect(focusedTexts[1].props.children).toBe('focused')
    expect(focusedTexts[2].props.children).toBe('not-focused')
  })

  test('filters out null children', () => {
    const { getAllByText } = renderWithProviders(
      <FormGroup>
        <TestChild />
        {null}
        <TestChild />
      </FormGroup>
    )

    expect(getAllByText(/Child/)).toHaveLength(2)
  })

  test('assigns isFirst and isLast correctly after null filtering', () => {
    const { getAllByTestId } = renderWithProviders(
      <FormGroup>
        {null}
        <TestChild />
        {null}
        <TestChild />
        {null}
      </FormGroup>
    )

    expect(getAllByTestId('first-prop')[0].props.children).toBe('first')
    expect(getAllByTestId('first-prop')[1].props.children).toBe('not-first')
    expect(getAllByTestId('last-prop')[0].props.children).toBe('not-last')
    expect(getAllByTestId('last-prop')[1].props.children).toBe('last')
  })
})
