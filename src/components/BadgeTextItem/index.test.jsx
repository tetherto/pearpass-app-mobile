import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { BadgeTextItem } from './index'

// Mock the theme provider colors
jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  ThemeProvider: ({ children }) => children,
  colors: {
    grey500: {
      mode1: '#666666'
    },
    white: {
      mode1: '#ffffff'
    },
    grey100: {
      mode1: '#cccccc'
    }
  }
}))

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('BadgeTextItem', () => {
  const defaultProps = {
    count: 1,
    word: 'testword',
    isNumberVisible: true
  }

  describe('Basic rendering', () => {
    it('renders correctly with default props', () => {
      const { getByText, toJSON } = renderWithTheme(
        <BadgeTextItem {...defaultProps} />
      )

      expect(getByText('#1')).toBeTruthy()
      expect(getByText('testword')).toBeTruthy()
      expect(toJSON()).toMatchSnapshot()
    })

    it('renders word text correctly', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} word="example" />
      )

      expect(getByText('example')).toBeTruthy()
    })

    it('renders count number correctly', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} count={5} />
      )

      expect(getByText('#5')).toBeTruthy()
    })
  })

  describe('Conditional count display', () => {
    it('shows count when isNumberVisible is true', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} isNumberVisible={true} />
      )

      expect(getByText('#1')).toBeTruthy()
    })

    it('hides count when isNumberVisible is false', () => {
      const { queryByText, getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} isNumberVisible={false} />
      )

      expect(queryByText('#1')).toBeNull()
      expect(getByText('testword')).toBeTruthy()
    })

    it('shows count for visible numbers with different counts', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem count={12} word="word12" isNumberVisible={true} />
      )

      expect(getByText('#12')).toBeTruthy()
      expect(getByText('word12')).toBeTruthy()
    })

    it('hides count for hidden numbers with different counts', () => {
      const { queryByText, getByText } = renderWithTheme(
        <BadgeTextItem count={13} word="randomword" isNumberVisible={false} />
      )

      expect(queryByText('#13')).toBeNull()
      expect(getByText('randomword')).toBeTruthy()
    })
  })

  describe('Component structure and styling', () => {
    it('renders with correct container structure', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} isNumberVisible={true} />
      )

      // The component should render both count and word
      expect(getByText('#1')).toBeTruthy()
      expect(getByText('testword')).toBeTruthy()
    })

    it('renders only word when isNumberVisible is false', () => {
      const { queryByText, getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} isNumberVisible={false} />
      )

      // Count should not be rendered
      expect(queryByText('#1')).toBeNull()
      // Word should still be rendered
      expect(getByText('testword')).toBeTruthy()
    })
  })

  describe('Edge cases and prop variations', () => {
    it('handles words with numbers', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem count={1} word="word123" isNumberVisible={true} />
      )

      expect(getByText('#1')).toBeTruthy()
      expect(getByText('word123')).toBeTruthy()
    })

    it('handles words with spaces', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem
          count={1}
          word="word with spaces"
          isNumberVisible={true}
        />
      )

      expect(getByText('#1')).toBeTruthy()
      expect(getByText('word with spaces')).toBeTruthy()
    })

    it('handles unicode characters in words', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem count={1} word="café" isNumberVisible={true} />
      )

      expect(getByText('#1')).toBeTruthy()
      expect(getByText('café')).toBeTruthy()
    })

    it('handles emoji in words', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem count={1} word="word🚀" isNumberVisible={true} />
      )

      expect(getByText('#1')).toBeTruthy()
      expect(getByText('word🚀')).toBeTruthy()
    })
  })

  describe('Accessibility and text properties', () => {
    it('applies correct text properties for word display', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} isNumberVisible={true} />
      )

      const wordText = getByText('testword')
      expect(wordText.props.numberOfLines).toBe(1)
      expect(wordText.props.ellipsizeMode).toBe('tail')
    })

    it('maintains text properties for hidden numbers', () => {
      const { getByText } = renderWithTheme(
        <BadgeTextItem {...defaultProps} isNumberVisible={false} />
      )

      const wordText = getByText('testword')
      expect(wordText.props.numberOfLines).toBe(1)
      expect(wordText.props.ellipsizeMode).toBe('tail')
    })
  })

  describe('Component integration', () => {
    it('works correctly when used in a list of badge items', () => {
      const words = ['first', 'second', 'third']
      const { getAllByText } = renderWithTheme(
        <>
          {words.map((word, index) => (
            <BadgeTextItem
              key={index}
              count={index + 1}
              word={word}
              isNumberVisible={true}
            />
          ))}
        </>
      )

      expect(getAllByText('#1')).toHaveLength(1)
      expect(getAllByText('#2')).toHaveLength(1)
      expect(getAllByText('#3')).toHaveLength(1)
      expect(getAllByText('first')).toHaveLength(1)
      expect(getAllByText('second')).toHaveLength(1)
      expect(getAllByText('third')).toHaveLength(1)
    })

    it('handles mixed visible and hidden numbers in a list', () => {
      const { getAllByText, queryByText } = renderWithTheme(
        <>
          <BadgeTextItem count={1} word="word1" isNumberVisible={true} />
          <BadgeTextItem count={2} word="word2" isNumberVisible={true} />
          <BadgeTextItem count={3} word="random" isNumberVisible={false} />
        </>
      )

      expect(getAllByText('#1')).toHaveLength(1)
      expect(getAllByText('#2')).toHaveLength(1)
      expect(queryByText('#3')).toBeNull()
      expect(getAllByText('word1')).toHaveLength(1)
      expect(getAllByText('word2')).toHaveLength(1)
      expect(getAllByText('random')).toHaveLength(1)
    })
  })

  describe('Snapshot tests', () => {
    it('matches snapshot with visible number', () => {
      const { toJSON } = renderWithTheme(
        <BadgeTextItem count={5} word="example" isNumberVisible={true} />
      )

      expect(toJSON()).toMatchSnapshot()
    })

    it('matches snapshot with hidden number', () => {
      const { toJSON } = renderWithTheme(
        <BadgeTextItem count={13} word="randomword" isNumberVisible={false} />
      )

      expect(toJSON()).toMatchSnapshot()
    })

    it('matches snapshot with long word', () => {
      const { toJSON } = renderWithTheme(
        <BadgeTextItem
          count={1}
          word="verylongwordthatshouldbetruncated"
          isNumberVisible={true}
        />
      )

      expect(toJSON()).toMatchSnapshot()
    })
  })
})
