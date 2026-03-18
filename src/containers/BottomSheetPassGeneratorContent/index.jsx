import { useMemo, useState } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import {
  generatePassphrase,
  generatePassword
} from '@tetherto/pearpass-utils-password-generator'

import { PassphraseChecker } from './PassphraseChecker'
import { PassphraseGenerator } from './PassphraseGenerator'
import { PasswordChecker } from './PasswordChecker'
import { PasswordGenerator } from './PasswordGenerator'
import { ActionsContainer, DividerLine, Title } from './styles'
import { RadioSelect } from '../../components/RadioSelect'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { ButtonPrimary, ButtonSecondary } from '../../libComponents'

/**
 * @param {{
 *  onPasswordInsert: (pass: string) => void
 * }} props
 */
export const BottomSheetPassGeneratorContent = ({ onPasswordInsert }) => {
  const { t } = useLingui()
  const { copyToClipboard } = useCopyToClipboard()

  const { collapse } = useBottomSheet()

  const [selectedOption, setSelectedOption] = useState('password')
  const [selectedRules, setSelectedRules] = useState({
    password: {
      specialCharacters: true,
      characters: 8
    },
    passphrase: {
      capitalLetters: true,
      symbols: true,
      numbers: true,
      words: 8
    }
  })

  const pass = useMemo(() => {
    if (selectedOption === 'passphrase') {
      return generatePassphrase(
        selectedRules.passphrase.capitalLetters,
        selectedRules.passphrase.symbols,
        selectedRules.passphrase.numbers,
        selectedRules.passphrase.words
      )
    } else {
      return generatePassword(selectedRules.password.characters, {
        includeSpecialChars: selectedRules.password.specialCharacters,
        lowerCase: true,
        upperCase: true,
        numbers: true
      })
    }
  }, [selectedOption, selectedRules])

  const handleRuleChange = (optionName, value) => {
    setSelectedRules((prevRules) => ({
      ...prevRules,
      [optionName]: value
    }))
  }

  const handleCopyAndClose = () => {
    const copyText = selectedOption === 'passphrase' ? pass.join('-') : pass

    copyToClipboard(copyText)
    collapse()
  }

  const handleInsertPassword = () => {
    const passText = selectedOption === 'passphrase' ? pass.join('-') : pass
    onPasswordInsert(passText)
    collapse()
  }

  return (
    <BottomSheetScrollView
      style={{
        flex: 1,
        padding: 20
      }}
      contentContainerStyle={{
        paddingBottom: 248
      }}
      showsVerticalScrollIndicator={true}
    >
      <Title>{t`Generate a password`}</Title>

      {selectedOption === 'passphrase' ? (
        <PassphraseChecker pass={pass} />
      ) : (
        <PasswordChecker pass={pass} />
      )}

      <DividerLine />

      <RadioSelect
        title={t`Type`}
        options={[
          { label: t`Password`, value: 'password' },
          { label: t`Passphrase`, value: 'passphrase' }
        ]}
        selectedOption={selectedOption}
        onChange={(value) => setSelectedOption(value)}
      />

      <DividerLine />

      {selectedOption === 'passphrase' ? (
        <PassphraseGenerator
          onRuleChange={handleRuleChange}
          rules={selectedRules.passphrase}
        />
      ) : (
        <PasswordGenerator
          onRuleChange={handleRuleChange}
          rules={selectedRules.password}
        />
      )}

      <ActionsContainer>
        {!!onPasswordInsert ? (
          <>
            <ButtonPrimary onPress={handleInsertPassword}>
              {t`Confirm`}
            </ButtonPrimary>
            <ButtonSecondary onPress={collapse}>{t`Cancel`}</ButtonSecondary>
          </>
        ) : (
          <ButtonPrimary onPress={handleCopyAndClose} stretch>
            {t`Copy and close`}
          </ButtonPrimary>
        )}
      </ActionsContainer>
    </BottomSheetScrollView>
  )
}
