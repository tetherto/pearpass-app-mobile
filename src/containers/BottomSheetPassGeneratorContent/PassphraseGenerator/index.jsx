import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import Slider from '@react-native-community/slider'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View } from 'react-native'

import { RuleSelector } from '../RuleSelector'
import {
  DividerLine,
  SliderText,
  SliderWrapper,
  SwitchWrapper
} from '../styles'

/**
 * @param {{
 *  rules: {
 *   capitalLetters: boolean,
 *   symbols: boolean,
 *   numbers: boolean,
 *   words: number
 *  }
 *  onRuleChange: (
 *    optionName: string,
 *    rules: {
 *      capitalLetters: boolean,
 *      symbols: boolean,
 *      numbers: boolean,
 *      words: number
 *   }) => void
 * }} props
 */
export const PassphraseGenerator = ({ onRuleChange, rules }) => {
  const { t } = useLingui()

  const ruleOptions = useMemo(
    () => [
      {
        name: 'all',
        label: t`Select All`,
        testIDOn: 'generate-password-popup-select-all-toggle-on',
        testIDOff: 'generate-password-popup-select-all-toggle-off',
        accessibilityLabelOn: t`Select All toggle`,
        accessibilityLabelOff: t`Select All toggle`
      },
      {
        name: 'capitalLetters',
        label: t`Capital Letters`,
        testIDOn: 'generate-password-popup-capital-letters-toggle-on',
        testIDOff: 'generate-password-popup-capital-letters-toggle-off',
        accessibilityLabelOn: t`Capital Letters toggle`,
        accessibilityLabelOff: t`Capital Letters toggle`
      },
      {
        name: 'symbols',
        label: t`Symbols`,
        testIDOn: 'generate-password-popup-symbols-toggle-on',
        testIDOff: 'generate-password-popup-symbols-toggle-off',
        accessibilityLabelOn: t`Symbols toggle`,
        accessibilityLabelOff: t`Symbols toggle`
      },
      {
        name: 'numbers',
        label: t`Numbers`,
        testIDOn: 'generate-password-popup-numbers-toggle-on',
        testIDOff: 'generate-password-popup-numbers-toggle-off',
        accessibilityLabelOn: t`Numbers toggle`,
        accessibilityLabelOff: t`Numbers toggle`
      }
    ],
    []
  )

  const handleRuleChange = (newRules) => {
    onRuleChange('passphrase', { ...rules, ...newRules })
  }

  const handleSliderValueChange = (value) => {
    onRuleChange('passphrase', { ...rules, words: value })
  }

  const { words, ...selectableRules } = rules

  return (
    <>
      <SliderWrapper>
        <View>
          <SliderText
            testID="generate-password-popup-length-label"
            accessibilityLabel={t`Generate password popup length label`}
          >
            {words} {t`words`}
          </SliderText>
        </View>

        <View>
          <Slider
            testID="generate-password-popup-length-slider"
            accessibilityLabel={t`Password length slider`}
            style={{ width: 240, height: 50 }}
            minimumValue={6}
            maximumValue={36}
            value={words}
            step={1}
            minimumTrackTintColor={colors.primary300.mode1}
            maximumTrackTintColor={colors.grey200.mode1}
            thumbTintColor={colors.primary400.mode1}
            onResponderGrant={() => true}
            onValueChange={handleSliderValueChange}
          />
        </View>
      </SliderWrapper>
      <DividerLine />

      <SwitchWrapper>
        <RuleSelector
          rules={ruleOptions}
          selectedRules={selectableRules}
          setRules={handleRuleChange}
        />
      </SwitchWrapper>
    </>
  )
}
