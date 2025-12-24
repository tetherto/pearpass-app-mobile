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
 *  nativeID?: string
 * }} props
 */
export const TextAreaReport = ({
  value,
  onChange,
  placeholder,
  isDisabled,
  onClick,
  testID,
  accessibilityLabel,
  nativeID
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
      nativeID={nativeID ?? testID}
    >
      <TextAreaComponent
        testID={testID ? `${testID}-input` : undefined}
        nativeID={testID ? `${testID}-input` : undefined}
        accessibilityLabel={testID ? `${testID}-input` : undefined}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        editable={!isDisabled}
        isFocused={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </TouchableOpacity>
  )
}
