import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import { PASSPHRASE_WORD_COUNTS } from 'pearpass-lib-constants'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import Toast from 'react-native-toast-message'

import { PassPhrase } from '../'
import messages from '../../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

// Mock the hooks
const mockCopyToClipboard = jest.fn()
const mockPasteFromClipboard = jest.fn()

jest.mock('../../../hooks/useCopyToClipboard', () => ({
  useCopyToClipboard: () => ({
    copyToClipboard: mockCopyToClipboard
  })
}))

jest.mock('../../../hooks/usePasteFromClipboard', () => ({
  usePasteFromClipboard: () => ({
    pasteFromClipboard: mockPasteFromClipboard
  })
}))

// Mock the icons
jest.mock('pearpass-lib-ui-react-native-components', () => ({
  CopyIcon: () => 'CopyIcon',
  PassPhraseIcon: () => 'PassPhraseIcon',
  PasteFromClipboardIcon: () => 'PasteFromClipboardIcon',
  ErrorIcon: () => 'ErrorIcon'
}))

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn()
  }
}))

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

const expectPassPhraseSettingsToBeInTheDocument = (getByText) => {
  expect(getByText('Type')).toBeTruthy()
  expect(getByText(`${PASSPHRASE_WORD_COUNTS.STANDARD_12} words`)).toBeTruthy()
  expect(getByText('+1 random word')).toBeTruthy()
}
const expectPassPhraseSettingsNotToBeInTheDocument = (queryByText) => {
  expect(queryByText('Type')).toBeNull()
  expect(queryByText(`${PASSPHRASE_WORD_COUNTS.STANDARD_12} words`)).toBeNull()
  expect(queryByText('+1 random word')).toBeNull()
}

describe('PassPhrase component', () => {
  const defaultProps = {
    isCreateOrEdit: false,
    onChange: jest.fn(),
    value: '',
    error: ''
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCopyToClipboard.mockClear()
    mockPasteFromClipboard.mockClear()
    Toast.show.mockClear()
  })

  describe('Basic rendering', () => {
    it('renders correctly with default props', () => {
      const { getByText, toJSON } = renderWithProviders(
        <PassPhrase {...defaultProps} />
      )

      expect(getByText('Recovery phrase')).toBeTruthy()
      expect(getByText('Copy')).toBeTruthy()
      expect(toJSON()).toMatchSnapshot()
    })

    it('renders correctly in create/edit mode', () => {
      const { getByText } = renderWithProviders(
        <PassPhrase {...defaultProps} isCreateOrEdit={true} />
      )

      expect(getByText('Recovery phrase')).toBeTruthy()
      expect(getByText('Paste from clipboard')).toBeTruthy()
    })

    it('renders error message when error is provided', () => {
      const errorMessage = 'Invalid passphrase'
      const { getByText } = renderWithProviders(
        <PassPhrase {...defaultProps} error={errorMessage} />
      )

      expect(getByText(errorMessage)).toBeTruthy()
    })

    it('does not render error when error is empty', () => {
      const { queryByTestId } = renderWithProviders(
        <PassPhrase {...defaultProps} error="" />
      )

      expect(queryByTestId('error-container')).toBeNull()
    })
  })

  describe('Passphrase parsing and display', () => {
    it('parses and displays 12-word passphrase correctly', () => {
      const passphrase =
        'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={passphrase} />
      )

      // Check that all words are rendered
      const words = passphrase.split(' ')
      words.forEach((word) => {
        expect(getAllByText(word)).toHaveLength(1)
      })

      // Check that count numbers are rendered
      for (let i = 1; i <= PASSPHRASE_WORD_COUNTS.STANDARD_12; i++) {
        expect(getAllByText(`#${i}`)).toHaveLength(1)
      }
    })

    it('parses and displays 24-word passphrase correctly', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_24 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={passphrase} />
      )

      // Check that all words are rendered
      words.forEach((word) => {
        expect(getAllByText(word)).toHaveLength(1)
      })
    })

    it('parses passphrase with hyphens as separators', () => {
      const passphrase = 'ww@ord1-wor45!_d2-wo/.rd3.-#word4@.'
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={passphrase} />
      )

      expect(getAllByText('ww@ord1')).toHaveLength(1)
      expect(getAllByText('wor45!_d2')).toHaveLength(1)
      expect(getAllByText('wo/.rd3.')).toHaveLength(1)
      expect(getAllByText('#word4@.')).toHaveLength(1)
    })

    it('filters out empty words', () => {
      const passphrase = 'word1   word2  -  word3'
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={passphrase} />
      )

      expect(getAllByText('word1')).toHaveLength(1)
      expect(getAllByText('word2')).toHaveLength(1)
      expect(getAllByText('word3')).toHaveLength(1)
    })

    it('handles empty value gracefully', () => {
      const { queryByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value="" />
      )

      expect(queryByText('#1')).toBeNull()
    })
  })

  describe('Settings detection and updates', () => {
    it('detects 12-word passphrase and updates settings', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_12 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={true}
        />
      )

      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })

    it('detects 13-word passphrase and updates settings', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.WITH_RANDOM_12 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={true}
        />
      )

      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })

    it('detects 24-word passphrase and updates settings', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_24 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={true}
        />
      )

      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })

    it('detects 25-word passphrase and updates settings', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.WITH_RANDOM_24 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={true}
        />
      )

      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })

    it('marks last word as random when withRandomWord is true', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.WITH_RANDOM_12 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={passphrase} />
      )

      expect(getAllByText('word13')).toHaveLength(1)
      for (let i = 1; i <= PASSPHRASE_WORD_COUNTS.WITH_RANDOM_12; i++) {
        expect(getAllByText(`#${i}`)).toHaveLength(1)
      }
    })

    it('does not mark any word as random when withRandomWord is false', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_12 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getAllByText, queryByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={passphrase} />
      )
      expect(queryByText('word13')).toBeNull()
      // All words should have count numbers
      for (let i = 1; i <= PASSPHRASE_WORD_COUNTS.STANDARD_12; i++) {
        expect(getAllByText(`#${i}`)).toHaveLength(1)
      }
    })
  })

  describe('Settings component integration', () => {
    it('renders PassPhraseSettings when in create/edit mode with valid word count', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_12 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={true}
        />
      )

      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })

    it('does not render PassPhraseSettings when not in create/edit mode', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_12 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { queryByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={false}
        />
      )

      expectPassPhraseSettingsNotToBeInTheDocument(queryByText)
    })

    it('does not render PassPhraseSettings when word count is out of range', () => {
      const words = Array.from({ length: 10 }, (_, i) => `word${i + 1}`)
      const passphrase = words.join(' ')
      const { queryByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={true}
        />
      )

      expectPassPhraseSettingsNotToBeInTheDocument(queryByText)
    })

    it('enables settings when no words are present', () => {
      const { getByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value="" isCreateOrEdit={true} />
      )

      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })
  })

  describe('Copy/Paste functionality', () => {
    it('shows copy button when not in create/edit mode', () => {
      const { getByText } = renderWithProviders(
        <PassPhrase {...defaultProps} isCreateOrEdit={false} />
      )

      expect(getByText('Copy')).toBeTruthy()
    })

    it('shows paste button when in create/edit mode', () => {
      const { getByText } = renderWithProviders(
        <PassPhrase {...defaultProps} isCreateOrEdit={true} />
      )

      expect(getByText('Paste from clipboard')).toBeTruthy()
    })

    it('calls copyToClipboard when copy button is pressed', () => {
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value="test passphrase"
          isCreateOrEdit={false}
        />
      )

      fireEvent.press(getByText('Copy'))
      expect(mockCopyToClipboard).toHaveBeenCalledWith('test passphrase')
    })

    it('calls pasteFromClipboard when paste button is pressed', async () => {
      const validPassphrase =
        'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
      mockPasteFromClipboard.mockResolvedValue(validPassphrase)

      const mockOnChange = jest.fn()
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          onChange={mockOnChange}
          isCreateOrEdit={true}
        />
      )

      await act(async () => {
        fireEvent.press(getByText('Paste from clipboard'))
      })

      await waitFor(() => {
        expect(mockPasteFromClipboard).toHaveBeenCalled()
        expect(mockOnChange).toHaveBeenCalledWith(validPassphrase)
      })
    })

    it('does not call onChange when pasteFromClipboard returns null', async () => {
      mockPasteFromClipboard.mockResolvedValue(null)

      const mockOnChange = jest.fn()
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          onChange={mockOnChange}
          isCreateOrEdit={true}
        />
      )

      await act(async () => {
        fireEvent.press(getByText('Paste from clipboard'))
      })

      await waitFor(() => {
        expect(mockPasteFromClipboard).toHaveBeenCalled()
        expect(mockOnChange).not.toHaveBeenCalled()
      })
    })

    it('shows error toast and does not call onChange when pasted recovery phrase has invalid word count', async () => {
      const invalidPassphrase = 'word1 word2 word3 word4 word5'
      mockPasteFromClipboard.mockResolvedValue(invalidPassphrase)

      const mockOnChange = jest.fn()
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          onChange={mockOnChange}
          isCreateOrEdit={true}
        />
      )

      await act(async () => {
        fireEvent.press(getByText('Paste from clipboard'))
      })

      await waitFor(() => {
        expect(mockPasteFromClipboard).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledWith({
          type: 'error',
          text1: 'Only 12 or 24 words are allowed',
          position: 'bottom',
          bottomOffset: 100
        })
        expect(mockOnChange).not.toHaveBeenCalled()
      })
    })

    it('preserves exact input after paste and copy with complex passphrase', async () => {
      const complexPassphrase =
        'Pizza8{ Jacket0_ Moon0^ Orange3. Apple5% Bicycle8; Mountain7$ Lemon3} Cat7+ House2+ Sunshine3| Balloon9]'

      mockPasteFromClipboard.mockResolvedValue(complexPassphrase)
      mockCopyToClipboard.mockImplementation(() => Promise.resolve())

      const mockOnChange = jest.fn()
      const { getByText, rerender } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          onChange={mockOnChange}
          isCreateOrEdit={true}
        />
      )

      // Step 1: Paste the complex passphrase
      await act(async () => {
        fireEvent.press(getByText('Paste from clipboard'))
      })

      await waitFor(() => {
        expect(mockPasteFromClipboard).toHaveBeenCalled()
        expect(mockOnChange).toHaveBeenCalledWith(complexPassphrase)
      })

      // Step 2: Switch to view mode and copy
      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <PassPhrase
              {...defaultProps}
              value={complexPassphrase}
              isCreateOrEdit={false}
            />
          </ThemeProvider>
        </I18nProvider>
      )

      // Step 3: Copy the passphrase
      fireEvent.press(getByText('Copy'))

      expect(mockCopyToClipboard).toHaveBeenCalledWith(complexPassphrase)
    })
  })

  describe('Value updates and effects', () => {
    it('updates passphrase words when value prop changes', () => {
      const { rerender, getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value="word1 word2" />
      )

      expect(getAllByText('word1')).toHaveLength(1)
      expect(getAllByText('word2')).toHaveLength(1)

      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <PassPhrase {...defaultProps} value="word1 word2 word3 word4" />
          </ThemeProvider>
        </I18nProvider>
      )

      expect(getAllByText('word1')).toHaveLength(1)
      expect(getAllByText('word2')).toHaveLength(1)
      expect(getAllByText('word3')).toHaveLength(1)
      expect(getAllByText('word4')).toHaveLength(1)
    })

    it('handles value changes and updates settings accordingly', () => {
      const { rerender, queryByText, getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value="word1 word2"
          isCreateOrEdit={true}
        />
      )

      expectPassPhraseSettingsNotToBeInTheDocument(queryByText)

      const words24 = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_24 },
        (_, i) => `word${i + 1}`
      )
      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <PassPhrase
              {...defaultProps}
              value={words24.join(' ')}
              isCreateOrEdit={true}
            />
          </ThemeProvider>
        </I18nProvider>
      )

      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })
  })

  describe('Edge cases', () => {
    it('handles undefined onChange gracefully', async () => {
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          onChange={undefined}
          isCreateOrEdit={true}
        />
      )

      await act(async () => {
        expect(() => {
          fireEvent.press(getByText('Paste from clipboard'))
        }).not.toThrow()
      })
    })

    it('handles malformed passphrase text', () => {
      const malformedText = '   -   -   word1   -   '
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={malformedText} />
      )

      expect(getAllByText('word1')).toHaveLength(1)
      expect(getAllByText('#1')).toHaveLength(1)
    })

    it('handles very long single word', () => {
      const longWord = 'a'.repeat(1000)
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={longWord} />
      )

      expect(getAllByText(longWord)).toHaveLength(1)
      expect(getAllByText('#1')).toHaveLength(1)
    })

    it('handles special characters in passphrase', () => {
      const specialPassphrase = 'word1@#$% word2!@# word3^&*'
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={specialPassphrase} />
      )

      expect(getAllByText('word1@#$%')).toHaveLength(1)
      expect(getAllByText('word2!@#')).toHaveLength(1)
      expect(getAllByText('word3^&*')).toHaveLength(1)
      expect(getAllByText('#1')).toHaveLength(1)
      expect(getAllByText('#2')).toHaveLength(1)
      expect(getAllByText('#3')).toHaveLength(1)
    })
  })

  describe('Component integration', () => {
    it('renders BadgeTextItem components for each word', () => {
      const passphrase = 'word1 word2 word3'
      const { getAllByText } = renderWithProviders(
        <PassPhrase {...defaultProps} value={passphrase} />
      )

      // Check that all words are rendered
      expect(getAllByText('word1')).toHaveLength(1)
      expect(getAllByText('word2')).toHaveLength(1)
      expect(getAllByText('word3')).toHaveLength(1)

      // Check that count numbers are rendered
      expect(getAllByText('#1')).toHaveLength(1)
      expect(getAllByText('#2')).toHaveLength(1)
      expect(getAllByText('#3')).toHaveLength(1)
    })

    it('renders PassPhraseSettings in create/edit mode with valid passphrase', () => {
      const words = Array.from(
        { length: PASSPHRASE_WORD_COUNTS.STANDARD_12 },
        (_, i) => `word${i + 1}`
      )
      const passphrase = words.join(' ')
      const { getByText } = renderWithProviders(
        <PassPhrase
          {...defaultProps}
          value={passphrase}
          isCreateOrEdit={true}
        />
      )

      // Check that settings UI is rendered
      expectPassPhraseSettingsToBeInTheDocument(getByText)
    })

    it('does not render PassPhraseSettings when not in create/edit mode', () => {
      const { queryByText } = renderWithProviders(
        <PassPhrase {...defaultProps} isCreateOrEdit={false} />
      )

      expectPassPhraseSettingsNotToBeInTheDocument(queryByText)
    })
  })
})
