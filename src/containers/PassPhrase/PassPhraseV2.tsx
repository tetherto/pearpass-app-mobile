import { useEffect, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  DEFAULT_SELECTED_TYPE,
  PASSPHRASE_WORD_COUNTS,
  VALID_WORD_COUNTS
} from '@tetherto/pearpass-lib-constants'
import {
  CopyIcon,
  PasteFromClipboardIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  Button,
  FieldError,
  InputField,
  Radio,
  rawTokens,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import { usePasteFromClipboard } from '../../hooks/usePasteFromClipboard'

type PassPhraseV2Props = {
  error?: string
  isCreateOrEdit?: boolean
  onChange?: (value: string) => void
  value?: string
}

const parsePassphraseText = (text: string) =>
  text
    .trim()
    .split(/[-\s]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)

const isValidRange = (wordCount: number) =>
  !wordCount || VALID_WORD_COUNTS.includes(wordCount)

const getWordLabel = (index: number) => {
  const position = index + 1
  const remainder10 = position % 10
  const remainder100 = position % 100

  let suffix = 'th'

  if (remainder10 === 1 && remainder100 !== 11) {
    suffix = 'st'
  } else if (remainder10 === 2 && remainder100 !== 12) {
    suffix = 'nd'
  } else if (remainder10 === 3 && remainder100 !== 13) {
    suffix = 'rd'
  }

  return `${position}${suffix} Word`
}

const getSelectedTypeForWords = (wordCount: number) => {
  if (
    wordCount === PASSPHRASE_WORD_COUNTS.STANDARD_24 ||
    wordCount === PASSPHRASE_WORD_COUNTS.WITH_RANDOM_24
  ) {
    return PASSPHRASE_WORD_COUNTS.STANDARD_24
  }

  if (
    wordCount === PASSPHRASE_WORD_COUNTS.STANDARD_12 ||
    wordCount === PASSPHRASE_WORD_COUNTS.WITH_RANDOM_12
  ) {
    return PASSPHRASE_WORD_COUNTS.STANDARD_12
  }

  return DEFAULT_SELECTED_TYPE
}

export const PassPhraseV2 = ({
  error,
  isCreateOrEdit = false,
  onChange,
  value = ''
}: PassPhraseV2Props) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { hapticButtonSecondary } = useHapticFeedback()
  const { copyToClipboard } = useCopyToClipboard()
  const { pasteFromClipboard } = usePasteFromClipboard()
  const lastCommittedValueRef = useRef(value)
  const initialWords = parsePassphraseText(value)

  const [selectedType, setSelectedType] = useState(
    getSelectedTypeForWords(initialWords.length)
  )
  const [passphraseWords, setPassphraseWords] = useState<string[]>(initialWords)

  const detectAndUpdateSettings = (words: string[]) => {
    setSelectedType(getSelectedTypeForWords(words.length))
  }

  useEffect(() => {
    if (value === lastCommittedValueRef.current) {
      return
    }

    if (!value?.trim().length) {
      setPassphraseWords([])
      lastCommittedValueRef.current = value
      return
    }

    const words = parsePassphraseText(value)
    setPassphraseWords(words)
    detectAndUpdateSettings(words)
    lastCommittedValueRef.current = value
  }, [value])

  const handlePasteFromClipboard = async () => {
    const pastedText = await pasteFromClipboard()

    if (!pastedText) {
      return
    }

    const words = parsePassphraseText(pastedText)

    if (!isValidRange(words.length)) {
      Toast.show({
        type: 'error',
        text1: t`Only 12 or 24 words are allowed`,
        position: 'bottom',
        bottomOffset: 100
      })
      return
    }

    setPassphraseWords(words)
    detectAndUpdateSettings(words)
    lastCommittedValueRef.current = pastedText
    onChange?.(pastedText)
  }

  const handleWordChange = (index: number, nextValue: string) => {
    const sanitizedValue = nextValue.replace(/\s+/g, '').trim()
    const nextWords = [...expandedWords]
    nextWords[index] = sanitizedValue
    setPassphraseWords(nextWords)

    const serializedValue = nextWords.filter(Boolean).join(' ')
    lastCommittedValueRef.current = serializedValue
    onChange?.(serializedValue)
  }

  const handleTypeSelect = (wordCount: number) => {
    setSelectedType(wordCount)

    if (passphraseWords.length > wordCount) {
      const nextWords = passphraseWords.slice(0, wordCount)
      setPassphraseWords(nextWords)

      const serializedValue = nextWords.filter(Boolean).join(' ')
      lastCommittedValueRef.current = serializedValue
      onChange?.(serializedValue)
    }
  }

  const optionsToRender = isCreateOrEdit
    ? [PASSPHRASE_WORD_COUNTS.STANDARD_12, PASSPHRASE_WORD_COUNTS.STANDARD_24]
    : [selectedType]
  const expandedWords = Array.from(
    { length: Math.max(selectedType, passphraseWords.length || selectedType) },
    (_, index) => passphraseWords[index] ?? ''
  )
  const detailWords = passphraseWords.length ? passphraseWords : parsePassphraseText(value)

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.groupContainer,
          {
            backgroundColor: theme.colors.colorSurfacePrimary,
            borderColor: error
              ? theme.colors.colorSurfaceDestructiveElevated
              : theme.colors.colorBorderPrimary
          }
        ]}
      >
        {!isCreateOrEdit ? (
          <View style={styles.optionSection}>
            <View style={styles.headerRow}>
              <View style={styles.headerInfo}>
                <Text variant="label">{t`Recovery Phrase`}</Text>
              </View>
              <Button
                variant="tertiary"
                size="small"
                aria-label="Copy recovery phrase"
                iconBefore={<CopyIcon color={theme.colors.colorTextPrimary} />}
                onClick={() => {
                  hapticButtonSecondary()
                  copyToClipboard(value)
                }}
              />
            </View>
            <View style={styles.grid}>
              {detailWords.map((word, inputIndex) => (
                <View
                  key={`details-word-${inputIndex}`}
                  style={styles.wordInputWrapper}
                >
                  <InputField
                    label={getWordLabel(inputIndex)}
                    value={word}
                    placeholder={t`Enter Word`}
                    readOnly
                    testID={`passphrase-word-input-${inputIndex}`}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : optionsToRender.map((wordCount, index) => {
          const isSelected = selectedType === wordCount
          const description = t`Paste or enter ${wordCount} words. Optional +1 works only when pasted`

          return (
            <View
              key={wordCount}
              style={[
                styles.optionSection,
                index > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.colorBorderPrimary
                }
              ]}
            >
              <View style={styles.headerRow}>
                <View style={styles.headerInfo}>
                  <Radio
                    builtIn
                    options={[
                      {
                        value: String(wordCount),
                        label: `${wordCount} Words`,
                        description
                      }
                    ]}
                    value={isSelected ? String(wordCount) : undefined}
                    onChange={
                      isCreateOrEdit
                        ? () => handleTypeSelect(wordCount)
                        : undefined
                    }
                    disabled={!isCreateOrEdit}
                  />
                </View>

                <Button
                  variant="tertiary"
                  size="small"
                  aria-label={
                    isCreateOrEdit
                      ? 'Paste recovery phrase'
                      : 'Copy recovery phrase'
                  }
                  iconBefore={
                    isCreateOrEdit ? (
                      <PasteFromClipboardIcon
                        color={theme.colors.colorTextPrimary}
                      />
                    ) : (
                      <CopyIcon color={theme.colors.colorTextPrimary} />
                    )
                  }
                  onClick={() => {
                    hapticButtonSecondary()

                    if (isCreateOrEdit) {
                      handleTypeSelect(wordCount)
                      void handlePasteFromClipboard()
                      return
                    }

                    copyToClipboard(value)
                  }}
                />
              </View>

              {isSelected ? (
                <View style={styles.grid}>
                  {expandedWords.map((word, inputIndex) => (
                    <View
                      key={`${wordCount}-${inputIndex}`}
                      style={styles.wordInputWrapper}
                    >
                      <InputField
                        label={getWordLabel(inputIndex)}
                        value={word}
                        placeholder={t`Enter Word`}
                        onChangeText={(nextValue) =>
                          handleWordChange(inputIndex, nextValue)
                        }
                        readOnly={!isCreateOrEdit}
                        testID={`passphrase-word-input-${inputIndex}`}
                      />
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          )
        })}
      </View>

      {/*
        The current product still supports pasted 13/25-word phrases.
        We keep that behavior, but the dedicated +1 toggle is intentionally removed.
      */}

      {!!error?.length && <FieldError>{error}</FieldError>}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: rawTokens.spacing12
  },
  groupContainer: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing8,
    overflow: 'hidden'
  },
  optionSection: {
    padding: rawTokens.spacing12,
    gap: rawTokens.spacing12
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing12
  },
  headerInfo: {
    flex: 1
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rawTokens.spacing12
  },
  wordInputWrapper: {
    width: '48%'
  }
})
