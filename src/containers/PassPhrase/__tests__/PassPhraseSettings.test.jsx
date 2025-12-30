import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, fireEvent } from '@testing-library/react-native'
import {
  PASSPHRASE_WORD_COUNTS,
  DEFAULT_SELECTED_TYPE,
  PASSPHRASE_TYPE_OPTIONS
} from 'pearpass-lib-constants'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import messages from '../../../locales/en/messages'
import { PassPhraseSettings } from '../PassPhraseSettings'

i18n.load('en', messages)
i18n.activate('en')

// Mock the RadioSelect component
const mockRadioSelect = jest.fn()
jest.mock('../../../components/RadioSelect', () => {
  const { View } = require('react-native')

  return {
    RadioSelect: (props) => {
      mockRadioSelect(props)
      return <View testID="mock-radio-select" />
    }
  }
})

const renderWithProviders = (ui) =>
  render(
    <I18nProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nProvider>
  )

describe('PassPhraseSettings', () => {
  const defaultProps = {
    selectedType: DEFAULT_SELECTED_TYPE,
    setSelectedType: jest.fn(),
    withRandomWord: false,
    setWithRandomWord: jest.fn(),
    isDisabled: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic rendering', () => {
    it('renders correctly with default props', () => {
      renderWithProviders(<PassPhraseSettings {...defaultProps} />)

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Type',
          selectedOption: DEFAULT_SELECTED_TYPE,
          isDisabled: false
        })
      )
    })

    it('renders with 12 words selected by default', () => {
      renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          selectedType={PASSPHRASE_WORD_COUNTS.STANDARD_12}
        />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedOption: PASSPHRASE_WORD_COUNTS.STANDARD_12
        })
      )
    })

    it('renders with 24 words selected', () => {
      renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          selectedType={PASSPHRASE_WORD_COUNTS.STANDARD_24}
        />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedOption: PASSPHRASE_WORD_COUNTS.STANDARD_24
        })
      )
    })
  })

  describe('RadioSelect integration', () => {
    it('passes correct props to RadioSelect', () => {
      renderWithProviders(<PassPhraseSettings {...defaultProps} />)

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Type',
          options: PASSPHRASE_TYPE_OPTIONS,
          selectedOption: DEFAULT_SELECTED_TYPE,
          isDisabled: false
        })
      )
    })

    it('calls setSelectedType when radio option is changed', () => {
      const mockSetSelectedType = jest.fn()
      renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          setSelectedType={mockSetSelectedType}
        />
      )

      // Get the onChange function that was passed to RadioSelect
      const radioSelectCall = mockRadioSelect.mock.calls[0]
      const onChange = radioSelectCall[0].onChange

      onChange(PASSPHRASE_WORD_COUNTS.STANDARD_24)
      expect(mockSetSelectedType).toHaveBeenCalledWith(
        PASSPHRASE_WORD_COUNTS.STANDARD_24
      )
    })

    it('calls setSelectedType when switching from 24 to 12', () => {
      const mockSetSelectedType = jest.fn()
      renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          selectedType={PASSPHRASE_WORD_COUNTS.STANDARD_24}
          setSelectedType={mockSetSelectedType}
        />
      )

      // Get the onChange function that was passed to RadioSelect
      const radioSelectCall = mockRadioSelect.mock.calls[0]
      const onChange = radioSelectCall[0].onChange

      onChange(PASSPHRASE_WORD_COUNTS.STANDARD_12)
      expect(mockSetSelectedType).toHaveBeenCalledWith(
        PASSPHRASE_WORD_COUNTS.STANDARD_12
      )
    })

    it('passes isDisabled prop to RadioSelect', () => {
      renderWithProviders(
        <PassPhraseSettings {...defaultProps} isDisabled={true} />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          isDisabled: true
        })
      )
    })

    it('passes isDisabled=false to RadioSelect when not disabled', () => {
      renderWithProviders(
        <PassPhraseSettings {...defaultProps} isDisabled={false} />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          isDisabled: false
        })
      )
    })
  })

  describe('Switch component', () => {
    it('renders switch with correct value when withRandomWord is false', () => {
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} withRandomWord={false} />
      )

      const switchElement = getByRole('switch')
      expect(switchElement.props.accessibilityState.checked).toBe(false)
    })

    it('renders switch with correct value when withRandomWord is true', () => {
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} withRandomWord={true} />
      )

      const switchElement = getByRole('switch')
      expect(switchElement.props.accessibilityState.checked).toBe(true)
    })

    it('calls setWithRandomWord when switch is toggled', () => {
      const mockSetWithRandomWord = jest.fn()
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          setWithRandomWord={mockSetWithRandomWord}
        />
      )

      const switchElement = getByRole('switch')
      fireEvent.press(switchElement)
      expect(mockSetWithRandomWord).toHaveBeenCalledWith(true)
    })

    it('calls setWithRandomWord with false when switch is turned off', () => {
      const mockSetWithRandomWord = jest.fn()
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          withRandomWord={true}
          setWithRandomWord={mockSetWithRandomWord}
        />
      )

      const switchElement = getByRole('switch')
      fireEvent.press(switchElement)
      expect(mockSetWithRandomWord).toHaveBeenCalledWith(false)
    })

    it('disables switch when isDisabled is true', () => {
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} isDisabled={true} />
      )

      const switchElement = getByRole('switch')
      expect(switchElement.props.accessibilityState.disabled).toBe(true)
    })

    it('enables switch when isDisabled is false', () => {
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} isDisabled={false} />
      )

      const switchElement = getByRole('switch')
      expect(switchElement.props.accessibilityState.disabled).toBeFalsy()
    })
  })

  describe('Props handling', () => {
    it('handles selectedType prop changes', () => {
      const { rerender } = renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          selectedType={DEFAULT_SELECTED_TYPE}
        />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedOption: DEFAULT_SELECTED_TYPE
        })
      )

      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <PassPhraseSettings
              {...defaultProps}
              selectedType={PASSPHRASE_WORD_COUNTS.STANDARD_24}
            />
          </ThemeProvider>
        </I18nProvider>
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedOption: PASSPHRASE_WORD_COUNTS.STANDARD_24
        })
      )
    })

    it('handles withRandomWord prop changes', () => {
      const { rerender, getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} withRandomWord={false} />
      )

      expect(getByRole('switch').props.accessibilityState.checked).toBe(false)

      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <PassPhraseSettings {...defaultProps} withRandomWord={true} />
          </ThemeProvider>
        </I18nProvider>
      )

      expect(getByRole('switch').props.accessibilityState.checked).toBe(true)
    })

    it('handles isDisabled prop changes', () => {
      const { rerender, getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} isDisabled={false} />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          isDisabled: false
        })
      )
      expect(getByRole('switch').props.accessibilityState.disabled).toBeFalsy()

      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <PassPhraseSettings {...defaultProps} isDisabled={true} />
          </ThemeProvider>
        </I18nProvider>
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          isDisabled: true
        })
      )
      expect(getByRole('switch').props.accessibilityState.disabled).toBe(true)
    })
  })

  describe('Disabled state', () => {
    it('disables both RadioSelect and Switch when isDisabled is true', () => {
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} isDisabled={true} />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          isDisabled: true
        })
      )
      expect(getByRole('switch').props.accessibilityState.disabled).toBe(true)
    })

    it('enables both RadioSelect and Switch when isDisabled is false', () => {
      const { getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} isDisabled={false} />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          isDisabled: false
        })
      )
      expect(getByRole('switch').props.accessibilityState.disabled).toBeFalsy()
    })
  })

  describe('Component structure and styling', () => {
    it('renders with correct container structure', () => {
      const { getByText, getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} />
      )

      expect(mockRadioSelect).toHaveBeenCalled()
      expect(getByText('+1 random word')).toBeTruthy()
      expect(getByRole('switch')).toBeTruthy()
    })

    it('renders random word container with correct layout', () => {
      const { getByText, getByRole } = renderWithProviders(
        <PassPhraseSettings {...defaultProps} />
      )

      const randomWordText = getByText('+1 random word')
      const switchElement = getByRole('switch')

      expect(randomWordText).toBeTruthy()
      expect(switchElement).toBeTruthy()
    })

    it('maintains consistent structure across different props', () => {
      const { getByText, getByRole } = renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          selectedType={24}
          withRandomWord={true}
          isDisabled={true}
        />
      )

      expect(mockRadioSelect).toHaveBeenCalled()
      expect(getByText('+1 random word')).toBeTruthy()
      expect(getByRole('switch')).toBeTruthy()
    })
  })

  describe('Edge cases', () => {
    it('handles undefined callbacks by throwing when RadioSelect onChange is called', () => {
      renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          setSelectedType={undefined}
          setWithRandomWord={undefined}
        />
      )

      const radioSelectCall = mockRadioSelect.mock.calls[0]
      const onChange = radioSelectCall[0].onChange

      expect(() => {
        onChange(PASSPHRASE_WORD_COUNTS.STANDARD_24)
      }).toThrow('setSelectedType is not a function')
    })

    it('handles null callbacks by throwing when RadioSelect onChange is called', () => {
      renderWithProviders(
        <PassPhraseSettings
          {...defaultProps}
          setSelectedType={null}
          setWithRandomWord={null}
        />
      )

      const radioSelectCall = mockRadioSelect.mock.calls[0]
      const onChange = radioSelectCall[0].onChange

      expect(() => {
        onChange(PASSPHRASE_WORD_COUNTS.STANDARD_24)
      }).toThrow('setSelectedType is not a function')
    })

    it('handles invalid selectedType values', () => {
      renderWithProviders(
        <PassPhraseSettings {...defaultProps} selectedType={999} />
      )

      expect(mockRadioSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedOption: 999
        })
      )
    })
  })
})
