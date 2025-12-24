import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  ErrorIcon,
  EyeClosedIcon,
  EyeIcon,
  KeyIcon,
  OkayIcon,
  YellowErrorIcon
} from 'pearpass-lib-ui-react-native-components'
import {
  checkPassphraseStrength,
  checkPasswordStrength
} from 'pearpass-utils-password-check'
import { View } from 'react-native'

import { ButtonLittle } from '../ButtonLittle'
import { InputField } from '../InputField'
import { PasswordStrongnessWrapper, PasswordText } from './styles'

const PASSWORD_STRENGTH_ICONS = {
  error: ErrorIcon,
  warning: YellowErrorIcon,
  success: OkayIcon
}

/**
 *
 * @param {{
 *  value: string,
 *  onChange: (e: any) => void,
 *  label: string,
 *  error: string,
 *  passType: 'password' | 'passphrase',
 *  additionalItems: any,
 *  placeholder: string,
 *  isDisabled: boolean,
 *  onClick: () => void,
 *  isLast: boolean,
 *  isFirst: boolean,
 *  hasStrongness: boolean,
 *  index: number,
 *  onFocus?: () => void,
 *  onBlur?: () => void,
 *  onInputLayout?: (event: any) => void,
 *  focusedIndex: number,
 *  type?: 'numeric' | 'default',
 *  belowInputContent?: React.ReactNode,
 *  shouldDisplayCustomPlaceholder?: boolean,
 *  testID?: string,
 *  inputTestID?: string,
 *  toggleTestID?: string
 * }} props
 */
export const PasswordField = ({
  value,
  onChange,
  label,
  error,
  passType = 'password',
  additionalItems,
  placeholder,
  isDisabled,
  onClick,
  isLast = false,
  isFirst = false,
  hasStrongness = false,
  index,
  onFocus,
  onBlur,
  onInputLayout,
  focusedIndex,
  type = 'default',
  icon,
  belowInputContent,
  shouldDisplayCustomPlaceholder = false,
  testID,
  inputTestID,
  toggleTestID
}) => {
  const { t } = useLingui()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isColored = isPasswordVisible && !isFocused && !!value.length

  const handleChange = (e) => {
    onChange?.(e)
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const getPasswordStrength = () => {
    if (!value?.length) {
      return null
    }

    const { strengthText, strengthType, success } =
      passType === 'password'
        ? checkPasswordStrength(value)
        : checkPassphraseStrength(value)

    if (!success) {
      return null
    }

    const Icon = PASSWORD_STRENGTH_ICONS[strengthType]
    return (
      <PasswordStrongnessWrapper>
        <Icon />
        <PasswordText strength={strengthType}>{t(strengthText)}</PasswordText>
      </PasswordStrongnessWrapper>
    )
  }

  return (
    <View>
      <InputField
        testID={testID ? `${testID}-field` : undefined}
        inputTestID={inputTestID ?? (testID ? `${testID}-input` : undefined)}
        label={label || 'Password'}
        variant="outline"
        icon={icon || KeyIcon}
        isDisabled={isDisabled}
        value={value}
        onChange={handleChange}
        onClick={onClick}
        placeholder={placeholder}
        error={error}
        isLast={isLast}
        isFirst={isFirst}
        index={index}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInputLayout={onInputLayout}
        focusedIndex={focusedIndex}
        isColored={isColored}
        type={type}
        belowInputContent={belowInputContent}
        shouldDisplayCustomPlaceholder={shouldDisplayCustomPlaceholder}
        additionalItems={
          <>
            {!!hasStrongness && getPasswordStrength()}
            {!!additionalItems && additionalItems}
            <ButtonLittle
              testID={toggleTestID ?? (testID ? `${testID}-toggle` : undefined)}
              accessibilityLabel={toggleTestID ?? (testID ? `${testID}-toggle` : undefined)}
              variant="secondary"
              borderRadius="md"
              startIcon={isPasswordVisible ? EyeClosedIcon : EyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          </>
        }
        isSecure={!isPasswordVisible}
      />
    </View>
  )
}
