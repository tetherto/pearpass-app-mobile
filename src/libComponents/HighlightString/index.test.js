import { render } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { HighlightString } from './index'

describe('HighlightString Component', () => {
  test('renders plain text without highlighting when there are no numbers or symbols', () => {
    const { getByText } = render(
      <ThemeProvider>
        <HighlightString text="Hello world" fontsize="20px" fontWeight={400} />
      </ThemeProvider>
    )
    expect(getByText('Hello world')).toBeTruthy()
  })

  test('renders and highlights numbers and symbols correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <HighlightString text="Hello123!" fontsize="20px" fontWeight={400} />
      </ThemeProvider>
    )

    expect(getByText('Hello ')).toBeTruthy()
    expect(getByText('123')).toBeTruthy()
    expect(getByText('!')).toBeTruthy()
  })

  test('passes numberOfLines prop to HighlightedText', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <HighlightString text="Test" numberOfLines={2} />
      </ThemeProvider>
    )
    const tree = toJSON()
    expect(tree.props.numberOfLines).toBe(2)
  })

  test('matches snapshot', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <HighlightString
          text="Test 42, wow!"
          fontsize="20px"
          fontWeight={400}
        />
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  test('passes testID to native component', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <HighlightString testID="highlight-string" text="Test 123!" />
      </ThemeProvider>
    )
    expect(getByTestId('highlight-string')).toBeTruthy()
  })
})
