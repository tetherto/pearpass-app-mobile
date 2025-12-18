import { useMemo } from 'react'

import { View } from 'react-native'

import {
  LabelContainers,
  SwitchDescription,
  SwitchText,
  Wrapper
} from './styles'
import { AppSwitch } from '../../../components/AppSwitch/AppSwitch'

/**
 * @param {{
 *  rules: {
 *    name: string,
 *    label: string,
 *    description: string,
 *    disabled: boolean
 *  }
 *  selectedRules: {[key: string]: any}
 *  setRules: ({[key: string]: any}) => void
 *  onToggle?: (ruleName: string, newValue: boolean) => boolean
 *  switchFirst?: boolean
 * }} props
 */
export const RuleSelector = ({
  rules,
  selectedRules,
  setRules,
  onToggle,
  switchFirst = false
}) => {
  const isAllRuleSelected = useMemo(
    () => Object.values(selectedRules).every((value) => value === true),
    [selectedRules]
  )

  const handleSwitchToggle = (ruleName) => {
    const currentValue = selectedRules[ruleName] || isAllRuleSelected
    const newValue = !currentValue

    // If onToggle callback exists and returns false, abort the toggle and prevent state update
    if (onToggle && !onToggle(ruleName, newValue)) return

    const updatedRules = { ...selectedRules }

    if (ruleName === 'all') {
      Object.keys(updatedRules).forEach((rule) => {
        updatedRules[rule] = !isAllRuleSelected
      })
    } else {
      updatedRules[ruleName] = newValue
    }

    setRules(updatedRules)
  }

  return (
    <>
      {rules.map((rule) => (
        <Wrapper switchFirst={switchFirst} key={rule.label}>
          <LabelContainers>
            <SwitchText>{rule.label}</SwitchText>
            {rule.description && (
              <SwitchDescription>{rule.description}</SwitchDescription>
            )}
          </LabelContainers>
          <View>
            <AppSwitch
              disabled={rule.disabled}
              value={selectedRules[rule.name] || isAllRuleSelected}
              onChange={() => handleSwitchToggle(rule.name)}
            />
          </View>
        </Wrapper>
      ))}
    </>
  )
}
