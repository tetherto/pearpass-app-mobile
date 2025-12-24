import { render } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import { Text } from 'react-native'

import { CompoundField } from './index'

describe('CompoundField Component', () => {
  test('renders children correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CompoundField>
          <Text>Child Content</Text>
        </CompoundField>
      </ThemeProvider>
    )
    expect(getByText('Child Content')).toBeTruthy()
  })

  test('matches snapshot when enabled', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <CompoundField isDisabled={false}>
          <Text>Child Content</Text>
        </CompoundField>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('matches snapshot when disabled', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <CompoundField isDisabled={true}>
          <Text>Child Content</Text>
        </CompoundField>
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to wrapper', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <CompoundField testID="compound-field">
          <Text>Child Content</Text>
        </CompoundField>
      </ThemeProvider>
    )
    expect(getByTestId('compound-field')).toBeTruthy()
  })
})
