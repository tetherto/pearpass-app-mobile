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
 *  as?: AsTarget,
 *  testID?: string,
 *  accessibilityLabel?: string,
 *  nativeID?: string
 * }} props
 */
export const InputPasswordPearPass = ({
  testID,
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
  accessibilityLabel,
  nativeID
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
      testID={testID ? `${testID}-wrapper` : undefined}
      onPress={handleClick}
      isFirst={isFirst}
      isLast={isLast}
      isFocused={isFocused}
      isPassword={isPassword}
    >
      {isPassword && (
        <IconWrapper testID={testID ? `${testID}-lock-icon` : undefined}>
          <LockCircleIcon size="21" />
        </IconWrapper>
      )}

      <MainWrapper>
        <Input
          ref={inputRef}
          testID={testID}
          nativeID={nativeID ?? testID}
          accessibilityLabel={accessibilityLabel ?? testID}
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
          <ErrorMessageWrapper testID={testID ? `${testID}-error` : undefined}>
            <ErrorIcon size="10" />
            <ErrorMessage> {error} </ErrorMessage>
          </ErrorMessageWrapper>
        )}
      </MainWrapper>
      {isPassword && (
        <AdditionalItems>
          <ButtonLittle
            testID={testID ? `${testID}-toggle-visibility` : undefined}
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
