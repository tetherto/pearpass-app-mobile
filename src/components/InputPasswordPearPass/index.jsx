import { useRef, useState } from 'react'

import {
  ErrorIcon,
  EyeClosedIcon,
  EyeIcon,
  LockCircleIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'

import {
  AdditionalItems,
  ErrorMessage,
  ErrorMessageWrapper,
  IconWrapper,
  Input,
  InputWrapper,
  MainWrapper
} from './styles'
import { ButtonLittle } from '../../libComponents'

/**
 * @param {{
 *  value?: string,
 *  onChange?: (e?: string) => void,
 *  error?: string,
 *  placeholder?: string,
 *  isDisabled?: boolean,
 *  isFirst?: boolean,
 *  isLast?: boolean,
 *  onClick?: () => void,
 *  type?: 'text' | 'password',
 *  isPassword: boolean
 * }} props
 */
export const InputPasswordPearPass = ({
  value,
  onChange,
  error,
  placeholder,
  isDisabled,
  isFirst = false,
  isLast = false,
  type = 'text',
  isPassword,
  onClick
}) => {
  const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isVisible, setIsVisible] = useState(!isPassword)

  const handleChange = (e) => {
    if (isDisabled) {
      return
    }
    onChange?.(e)
  }

  const handleClick = () => {
    inputRef.current?.focus()

    onClick?.()
  }

  return (
    <InputWrapper
      onPress={handleClick}
      isFirst={isFirst}
      isLast={isLast}
      isFocused={isFocused}
      isPassword={isPassword}
    >
      {isPassword && (
        <IconWrapper>
          <LockCircleIcon size="21" />
        </IconWrapper>
      )}

      <MainWrapper>
        <Input
          ref={inputRef}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          editable={!isDisabled}
          secureTextEntry={!isVisible}
          isPassword
          type={type}
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
        />

        {!!error?.length && (
          <ErrorMessageWrapper>
            <ErrorIcon size="10" />
            <ErrorMessage> {error} </ErrorMessage>
          </ErrorMessageWrapper>
        )}
      </MainWrapper>
      {isPassword && (
        <AdditionalItems>
          <ButtonLittle
            variant="secondary"
            borderRadius="md"
            onPress={() => setIsVisible(!isVisible)}
            startIcon={isVisible ? EyeClosedIcon : EyeIcon}
          />
        </AdditionalItems>
      )}
    </InputWrapper>
  )
}
