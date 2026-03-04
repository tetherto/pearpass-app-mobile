import { useState } from 'react'

import { TouchableOpacity } from 'react-native'

import { TextAreaComponent } from './styles'

/**
 * @param {{
 *  value?: string
 *  onChange?: (text: string) => void
 *  placeholder?: string
 *  isDisabled?: boolean
 *  onClick?: () => void
 *  testID?: string
 *  accessibilityLabel?: string
 *  inputAccessibilityLabel?: string
 * }} props
 */
export const TextArea = ({
  value,
  onChange,
  placeholder,
  isDisabled,
  onClick,
  testID,
  accessibilityLabel,
  inputAccessibilityLabel
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleChangeText = (text) => {
    if (isDisabled) {
      return
    }
    onChange?.(text)
  }

  const handleClick = () => {
    onClick?.()
  }

  return (
    <TouchableOpacity
      onPress={handleClick}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      <TextAreaComponent
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        editable={!isDisabled}
        isFocused={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        testID={testID ? `${testID}-input` : undefined}
        accessibilityLabel={inputAccessibilityLabel}
      />
    </TouchableOpacity>
  )
}
