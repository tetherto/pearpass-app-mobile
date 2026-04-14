import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  checkPassphraseStrength,
  checkPasswordStrength
} from '@tetherto/pearpass-utils-password-check'
import {
  generatePassphrase,
  generatePassword
} from '@tetherto/pearpass-utils-password-generator'
import {
  Button,
  PasswordIndicator,
  Radio,
  Slider,
  Text,
  Title,
  ToggleSwitch,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { css } from 'react-strict-dom'
import { Pressable, StyleSheet, View } from 'react-native'

import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from '../../../containers/ScreenLayout'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import { ContentCopy } from '@tetherto/pearpass-lib-ui-kit/icons'

const PASSWORD_OPTIONS = {
  password: 'password',
  passphrase: 'passphrase'
} as const

type PasswordOption = (typeof PASSWORD_OPTIONS)[keyof typeof PASSWORD_OPTIONS]

type PasswordRules = {
  specialCharacters: boolean
  characters: number
}

type PassphraseRules = {
  capitalLetters: boolean
  symbols: boolean
  numbers: boolean
  words: number
}

const STRENGTH_TO_INDICATOR = {
  vulnerable: 'vulnerable',
  weak: 'decent',
  safe: 'strong'
} as const

const titleStyles = css.create({
  generatedPasswordTitle: {
    textAlign: 'center'
  }
})

const renderHighlightedPassword = (
  text: string,
  primaryColor: string,
  secondaryColor: string
) => {
  const parts = text.split(/(\d+|[^a-zA-Z\d\s])/g)

  return parts.map((part, index) => {
    if (!part) {
      return null
    }

    if (/^\d+$/.test(part)) {
      return (
        <Text
          key={`${part}-${index}`}
          color={primaryColor}
          variant="bodyEmphasized"
        >
          {part}
        </Text>
      )
    }

    if (/[^a-zA-Z\d\s]/.test(part)) {
      return (
        <Text
          key={`${part}-${index}`}
          color={secondaryColor}
          variant="bodyEmphasized"
        >
          {part}
        </Text>
      )
    }

    return (
      <Text key={`${part}-${index}`} variant="bodyEmphasized">
        {part}
      </Text>
    )
  })
}

type CreatePasswordItemV2Props = {
  route?: {
    params?: {
      onPasswordInsert?: (value: string) => void
    }
  }
}

export const CreatePasswordItemV2 = ({
  route
}: CreatePasswordItemV2Props) => {
  const navigation = useNavigation<any>()
  const { t } = useLingui()
  const { theme } = useTheme()
  const { copyToClipboard } = useCopyToClipboard()
  const onPasswordInsert = route?.params?.onPasswordInsert

  const [selectedOption, setSelectedOption] =
    useState<PasswordOption>(PASSWORD_OPTIONS.password)
  const [selectedRules, setSelectedRules] = useState<{
    password: PasswordRules
    passphrase: PassphraseRules
  }>({
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

  const generatedValue = useMemo(() => {
    if (selectedOption === PASSWORD_OPTIONS.passphrase) {
      return generatePassphrase(
        selectedRules.passphrase.capitalLetters,
        selectedRules.passphrase.symbols,
        selectedRules.passphrase.numbers,
        selectedRules.passphrase.words
      ).join('-')
    }

    return generatePassword(selectedRules.password.characters, {
      includeSpecialChars: selectedRules.password.specialCharacters,
      lowerCase: true,
      upperCase: true,
      numbers: true
    })
  }, [selectedOption, selectedRules])

  const strength = useMemo(() => {
    if (selectedOption === PASSWORD_OPTIONS.passphrase) {
      return checkPassphraseStrength(generatedValue.split('-'))
    }

    return checkPasswordStrength(generatedValue)
  }, [generatedValue, selectedOption])

  const indicatorVariant = STRENGTH_TO_INDICATOR[strength.type]

  const isAllPassphraseRulesSelected =
    selectedRules.passphrase.capitalLetters &&
    selectedRules.passphrase.symbols &&
    selectedRules.passphrase.numbers

  const handlePasswordRuleChange = (
    key: keyof PasswordRules,
    value: boolean | number
  ) => {
    setSelectedRules((prev) => ({
      ...prev,
      password: {
        ...prev.password,
        [key]: value
      }
    }))
  }

  const handlePassphraseRuleChange = (
    key: keyof PassphraseRules,
    value: boolean | number
  ) => {
    setSelectedRules((prev) => ({
      ...prev,
      passphrase: {
        ...prev.passphrase,
        [key]: value
      }
    }))
  }

  const handlePassphraseToggle = (rule: 'all' | keyof PassphraseRules) => {
    if (rule === 'all') {
      const nextValue = !isAllPassphraseRulesSelected

      setSelectedRules((prev) => ({
        ...prev,
        passphrase: {
          ...prev.passphrase,
          capitalLetters: nextValue,
          symbols: nextValue,
          numbers: nextValue
        }
      }))

      return
    }

    handlePassphraseRuleChange(rule, !selectedRules.passphrase[rule])
  }

  const handlePrimaryAction = () => {
    if (onPasswordInsert) {
      onPasswordInsert(generatedValue)
      navigation.goBack()
      return
    }

    copyToClipboard(generatedValue)
  }

  return (
    <ScreenLayout
      scrollable
      contentStyle={styles.content}
      header={
        <BackScreenHeader
          title={t`New Password Item`}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <Button
          variant="primary"
          fullWidth
          onClick={handlePrimaryAction}
          iconBefore={
            onPasswordInsert
              ? undefined
              : <ContentCopy color={theme.colors.colorOnPrimary} />
          }
        >
          {onPasswordInsert ? t`Use Password` : t`Copy Password`}
        </Button>
      }
    >
      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Generated Password`}
        </Text>

        <View
          style={[
            styles.groupedCard,
            {
              borderColor: theme.colors.colorBorderPrimary,
              backgroundColor: theme.colors.colorSurfacePrimary
            }
          ]}
        >
          <View
            style={[
              styles.generatedPasswordBlock,
              { borderBottomColor: theme.colors.colorBorderPrimary }
            ]}
          >
            <View style={styles.generatedPasswordText}>
              <Title as="h3" style={titleStyles.generatedPasswordTitle}>
                {renderHighlightedPassword(
                  generatedValue,
                  theme.colors.colorPrimary,
                  theme.colors.colorTextSecondary
                )}
              </Title>
            </View>

            <View style={styles.strengthRow}>
              <PasswordIndicator variant={indicatorVariant} />
            </View>
          </View>

          {[
            {
              key: PASSWORD_OPTIONS.passphrase,
              label: t`Memorable Password`,
              description: t`Memorable password using random words, numbers, and symbols.`
            },
            {
              key: PASSWORD_OPTIONS.password,
              label: t`Random Characters`,
              description: t`A fully random mix of letters, numbers, and symbols.`
            }
          ].map((option, index, options) => (
            <Pressable
              key={option.key}
              onPress={() => setSelectedOption(option.key)}
              style={[
                styles.optionRow,
                index < options.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.colorBorderPrimary
                }
              ]}
            >
              <View pointerEvents="none" style={styles.optionContent}>
                <Radio
                  builtIn
                  options={[
                    {
                      value: option.key,
                      label: option.label,
                      description: option.description
                    }
                  ]}
                  value={selectedOption === option.key ? option.key : undefined}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Password Length`}
        </Text>

        <View
          style={[
            styles.singleRowCard,
            {
              borderColor: theme.colors.colorBorderPrimary,
              backgroundColor: theme.colors.colorSurfacePrimary
            }
          ]}
        >
          <View style={styles.sliderRow}>
            <View style={styles.sliderLabel}>
              <Text variant="bodyEmphasized">
                {selectedOption === PASSWORD_OPTIONS.passphrase
                  ? `${selectedRules.passphrase.words} ${t`words`}`
                  : `${selectedRules.password.characters} ${t`chars`}`}
              </Text>
            </View>

            <View style={styles.slider}>
              <Slider
              minimumValue={
                selectedOption === PASSWORD_OPTIONS.passphrase ? 6 : 4
              }
              maximumValue={
                selectedOption === PASSWORD_OPTIONS.passphrase ? 36 : 32
              }
              step={1}
              value={
                selectedOption === PASSWORD_OPTIONS.passphrase
                  ? selectedRules.passphrase.words
                  : selectedRules.password.characters
              }
              minimumTrackTintColor={theme.colors.colorPrimary}
              maximumTrackTintColor={theme.colors.colorSurfaceElevatedOnInteraction}
              thumbTintColor={theme.colors.colorPrimary}
              onValueChange={(value) => {
                if (selectedOption === PASSWORD_OPTIONS.passphrase) {
                  handlePassphraseRuleChange('words', value)
                  return
                }

                handlePasswordRuleChange('characters', value)
              }}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Password settings`}
        </Text>

        <View
          style={[
            styles.groupedCard,
            {
              borderColor: theme.colors.colorBorderPrimary,
              backgroundColor: theme.colors.colorSurfacePrimary
            }
          ]}
        >
          {selectedOption === PASSWORD_OPTIONS.passphrase ? (
            [
              {
                key: 'all',
                label: t`Select all`,
                value: isAllPassphraseRulesSelected
              },
              {
                key: 'capitalLetters',
                label: t`Capital letters`,
                value: selectedRules.passphrase.capitalLetters
              },
              {
                key: 'symbols',
                label: t`Symbols`,
                value: selectedRules.passphrase.symbols
              },
              {
                key: 'numbers',
                label: t`Numbers`,
                value: selectedRules.passphrase.numbers
              }
            ].map((rule, index, rules) => (
              <View
                key={rule.key}
                style={[
                  styles.settingRow,
                  index < rules.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.colorBorderPrimary
                  }
                ]}
              >
                <Text variant="bodyEmphasized">{rule.label}</Text>

                <ToggleSwitch
                  checked={rule.value}
                  onChange={() =>
                    handlePassphraseToggle(
                      rule.key as 'all' | keyof PassphraseRules
                    )
                  }
                  aria-label={rule.label}
                />
              </View>
            ))
          ) : (
            <View style={styles.settingRow}>
              <Text variant="bodyEmphasized">{t`Special character (!&*)`}</Text>

              <ToggleSwitch
                checked={selectedRules.password.specialCharacters}
                onChange={() =>
                  handlePasswordRuleChange(
                    'specialCharacters',
                    !selectedRules.password.specialCharacters
                  )
                }
                aria-label={t`Special character toggle`}
              />
            </View>
          )}
        </View>
      </View>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: rawTokens.spacing16,
    paddingHorizontal: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing16,
    gap: rawTokens.spacing24
  },
  section: {
    gap: rawTokens.spacing12
  },
  groupedCard: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing8,
    overflow: 'hidden'
  },
  singleRowCard: {
    borderWidth: 1,
    borderRadius: rawTokens.spacing8,
    overflow: 'hidden',
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing20
  },
  generatedPasswordBlock: {
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing24,
    alignItems: 'center',
    gap: rawTokens.spacing16,
    borderBottomWidth: 1
  },
  generatedPasswordText: {
    alignItems: 'center'
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4
  },
  optionRow: {
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing12
  },
  optionContent: {
    flex: 1
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing12
  },
  sliderLabel: {
    width: 72
  },
  slider: {
    flex: 1,
    height: rawTokens.spacing24
  },
  settingRow: {
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: rawTokens.spacing12
  }
})
