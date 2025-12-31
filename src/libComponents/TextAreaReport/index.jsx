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
 * }} props
 */
export const TextAreaReport = ({
  value,
  onChange,
  placeholder,
  isDisabled,
  onClick,
  testID
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
    <TouchableOpacity onPress={handleClick} testID={testID}>
      <TextAreaComponent
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        editable={!isDisabled}
        isFocused={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        testID={testID ? `${testID}-input` : undefined}
      />
    </TouchableOpacity>
  )
}
