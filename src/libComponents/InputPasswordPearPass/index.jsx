import { useRef, useState } from 'react'

import {
  ErrorIcon,
  EyeClosedIcon,
  EyeIcon,
  LockCircleIcon
} from 'pearpass-lib-ui-react-native-components'

import { ButtonLittle } from '../ButtonLittle'
import {
  AdditionalItems,
  ErrorMessage,
  ErrorMessageWrapper,
  IconWrapper,
  Input,
  InputWrapper,
  MainWrapper
} from './styles'

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
 *  isPassword: boolean,
 *  as?: AsTarget
 *  testID?: string
 *  toggleVisibilityTestID?: string
 *  errorTestID?: string
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
  onClick,
  as,
  testID,
  toggleVisibilityTestID,
  errorTestID
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
      testID={testID}
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
          as={as}
        />

        {!!error?.length && (
          <ErrorMessageWrapper testID={errorTestID}>
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
            testID={toggleVisibilityTestID}
          />
        </AdditionalItems>
      )}
    </InputWrapper>
  )
}
