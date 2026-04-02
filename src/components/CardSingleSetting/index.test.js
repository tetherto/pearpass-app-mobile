import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { Text, View } from 'react-native'

import { CardSingleSetting } from './index'

describe('CardSingleSetting', () => {
  it('renders correctly with title and children', () => {
    const { getByText, toJSON } = render(
      <ThemeProvider>
        <CardSingleSetting title="Settings Title">
          <Text>Test Content</Text>
        </CardSingleSetting>
      </ThemeProvider>
    )

    expect(getByText('Settings Title')).toBeTruthy()
    expect(getByText('Test Content')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders without children', () => {
    const { getByText, toJSON } = render(
      <ThemeProvider>
        <CardSingleSetting title="Empty Setting" />
      </ThemeProvider>
    )

    expect(getByText('Empty Setting')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders with a long title', () => {
    const longTitle =
      'This is a very long setting title that might wrap or cause layout issues'
    const { getByText, toJSON } = render(
      <ThemeProvider>
        <CardSingleSetting title={longTitle}>
          <Text>Content with long title</Text>
        </CardSingleSetting>
      </ThemeProvider>
    )

    expect(getByText(longTitle)).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders with complex children components', () => {
    const { getByText, toJSON } = render(
      <ThemeProvider>
        <CardSingleSetting title="Complex Setting">
          <View>
            <Text>Nested content</Text>
          </View>
        </CardSingleSetting>
      </ThemeProvider>
    )

    expect(getByText('Complex Setting')).toBeTruthy()
    expect(getByText('Nested content')).toBeTruthy()
    expect(toJSON()).toMatchSnapshot()
  })
})
