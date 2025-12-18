import { useState, useEffect } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  PASSPHRASE_WORD_COUNTS,
  VALID_WORD_COUNTS,
  DEFAULT_SELECTED_TYPE
} from 'pearpass-lib-constants'
import {
  CopyIcon,
  PassPhraseIcon,
  PasteFromClipboardIcon,
  ErrorIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'

import { PassPhraseSettings } from './PassPhraseSettings'
import { BadgeTextItem } from '../../components/BadgeTextItem'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { usePasteFromClipboard } from '../../hooks/usePasteFromClipboard'

/**
 * @param {{
 *  isCreateOrEdit: boolean,
 *  onChange: (value: string) => void,
 *  value: string,
 *  error: string
 * }} props
 */

export const PassPhrase = ({ isCreateOrEdit, onChange, value, error }) => {
  const { t } = useLingui()
  const [selectedType, setSelectedType] = useState(DEFAULT_SELECTED_TYPE)
  const [withRandomWord, setWithRandomWord] = useState(false)
  const [passphraseWords, setPassphraseWords] = useState([])

  const { copyToClipboard } = useCopyToClipboard()
  const { pasteFromClipboard } = usePasteFromClipboard()

  const parsePassphraseText = (text) =>
    text
      .trim()
      .split(/[-\s]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 0)

  const detectAndUpdateSettings = (words) => {
    const wordCount = words.length
    if (
      wordCount === PASSPHRASE_WORD_COUNTS.STANDARD_12 ||
      wordCount === PASSPHRASE_WORD_COUNTS.WITH_RANDOM_12
    ) {
      setSelectedType(PASSPHRASE_WORD_COUNTS.STANDARD_12)
      setWithRandomWord(wordCount === PASSPHRASE_WORD_COUNTS.WITH_RANDOM_12)
    } else if (
      wordCount === PASSPHRASE_WORD_COUNTS.STANDARD_24 ||
      wordCount === PASSPHRASE_WORD_COUNTS.WITH_RANDOM_24
    ) {
      setSelectedType(PASSPHRASE_WORD_COUNTS.STANDARD_24)
      setWithRandomWord(wordCount === PASSPHRASE_WORD_COUNTS.WITH_RANDOM_24)
    }
  }

  const isValidRange = (wordCount) =>
    !wordCount || VALID_WORD_COUNTS.includes(wordCount)

  const handlePasteFromClipboard = async () => {
    const pastedText = await pasteFromClipboard()
    if (pastedText) {
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
      if (onChange) {
        onChange(pastedText)
      }
    }
  }

  useEffect(() => {
    if (value) {
      const words = parsePassphraseText(value)
      setPassphraseWords(words)
      detectAndUpdateSettings(words)
    }
  }, [value])

  return (
    <View style={styles.container}>
      <View style={styles.passPhraseHeader}>
        <PassPhraseIcon />
        <Text style={styles.passPhraseHeaderText}>{t`Recovery phrase`}</Text>
      </View>
      <View style={styles.passPhraseContainer}>
        {passphraseWords.map((word, i) => (
          <BadgeTextItem key={`${word}-${i}`} count={i + 1} word={word || ''} />
        ))}
      </View>

      <TouchableOpacity
        style={styles.copyContainer}
        onPress={
          isCreateOrEdit
            ? handlePasteFromClipboard
            : () => copyToClipboard(value)
        }
      >
        {isCreateOrEdit ? (
          <>
            <PasteFromClipboardIcon color={colors.primary400?.mode1} />
            <Text style={styles.copyPasteText}>{t`Paste from clipboard`}</Text>
          </>
        ) : (
          <>
            <CopyIcon color={colors.primary400?.mode1} />
            <Text style={styles.copyPasteText}>{t`Copy`}</Text>
          </>
        )}
      </TouchableOpacity>
      {isCreateOrEdit && isValidRange(passphraseWords.length) && (
        <PassPhraseSettings
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          withRandomWord={withRandomWord}
          setWithRandomWord={setWithRandomWord}
          isDisabled={!!passphraseWords.length}
        />
      )}

      {!!error?.length && (
        <View style={styles.errorContainer}>
          <ErrorIcon size="10" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey400?.mode1,
    borderWidth: 1,
    borderColor: colors.grey100?.mode1,
    borderRadius: 10,
    padding: 10,
    gap: 20
  },
  passPhraseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  passPhraseHeaderText: {
    color: colors.white?.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 400
  },
  copyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    color: colors.primary400?.mode1
  },
  copyPasteText: {
    color: colors.primary400?.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center'
  },
  passPhraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 15,
    justifyContent: 'space-around'
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10
  },
  errorText: {
    color: colors.categoryIdentity.mode1,
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 500
  }
})
