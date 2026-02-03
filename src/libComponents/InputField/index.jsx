import { useRef, useState } from 'react'

import { ErrorIcon, CopyIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'
import { useTheme } from 'styled-components/native'

import { HighlightString } from '../HighlightString'

/**
 * @param {{
 *  value?: string,
 *  onChange?: (e?: string) => void,
 *  icon?: import('react').FC,
 *  label?: string,
 *  error?: string,
 *  additionalItems?: ReactNode,
 *  placeholder?: string,
 *  isDisabled?: boolean,
 *  isFirst?: boolean,
 *  isLast?: boolean,
 *  focusedIndex?: number,
 *  index?: number,
 *  onFocus?: () => void,
 *  onBlur?: () => void,
 *  onClick?: () => void,
 *  onInputLayout?: (event: any) => void,
 *  type?: 'numeric' | 'default',
 *  isSecure: boolean,
 *  isColored: boolean,
 *  variant?: 'default' | 'outline',
 *  isTransparent: boolean,
 *  belowInputContent?: React.ReactNode,
 *  shouldDisplayCustomPlaceholder?: boolean
 *  testID?: string
 *  accessibilityLabel?: string
 *  inputAccessibilityLabel?: string
 * }} props
 */
export const InputField = ({
  value,
  onChange,
  icon,
  label,
  error,
  additionalItems,
  placeholder,
  isDisabled,
  isFirst = false,
  isLast = false,
  onFocus,
  onBlur,
  onInputLayout,
  focusedIndex,
  type = 'default',
  variant = 'default',
  isSecure = false,
  isColored = false,
  onClick,
  index,
  isTransparent = false,
  belowInputContent,
  shouldDisplayCustomPlaceholder = false,
  testID,
  accessibilityLabel,
  inputAccessibilityLabel
}) => {
  const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const theme = useTheme()

  const handleChange = (e) => {
    if (isDisabled) {
      return
    }

    onChange?.(e)
  }

  const handleClick = () => {
    if (isDisabled && onClick) {
      onClick()
      return
    }

    inputRef.current?.focus()
    onClick?.()
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const Icon = icon

  const getWrapperStyle = () => {
    if (variant === 'outline') {
      const prevIsFocused = focusedIndex === index - 1
      return [
        styles.wrapper,
        styles.outlineWrapper,
        {
          borderTopColor:
            isFocused || prevIsFocused
              ? theme.colors.primary400.mode1
              : theme.colors.grey100.mode1,
          borderLeftColor: isFocused
            ? theme.colors.primary400.mode1
            : theme.colors.grey100.mode1,
          borderBottomColor: isFocused
            ? theme.colors.primary400.mode1
            : theme.colors.grey100.mode1,
          borderRightColor: isFocused
            ? theme.colors.primary400.mode1
            : theme.colors.grey100.mode1,
          borderTopLeftRadius: isFirst ? 10 : 0,
          borderTopRightRadius: isFirst ? 10 : 0,
          borderBottomLeftRadius: isLast ? 10 : 0,
          borderBottomRightRadius: isLast ? 10 : 0,
          borderBottomWidth: isLast ? 1 : 0,
          backgroundColor: theme.colors.grey400.mode1
        }
      ]
    }

    return [
      styles.wrapper,
      styles.defaultWrapper,
      {
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: theme.colors.grey100.mode1
      }
    ]
  }

  const InputContent = (
    <View
      style={[
        styles.inputWrapper,
        {
          paddingTop: 20,
          paddingBottom: belowInputContent ? 10 : 20,
          paddingLeft: 12,
          paddingRight: 10
        }
      ]}
    >
      {!!icon && (
        <View style={styles.iconWrapper}>
          <Icon size="21" />
        </View>
      )}
      <View style={styles.mainWrapper}>
        <Text style={styles.label}> {label} </Text>

        <View style={styles.inputContainer}>
          {isDisabled ? (
            <ScrollView horizontal>
              <View style={styles.scrollableTextContainer}>
                <Text
                  style={[
                    styles.input,
                    {
                      color: !value
                        ? colors.grey100.mode1
                        : isTransparent || isColored
                          ? 'transparent'
                          : type === 'url'
                            ? theme.colors.primary400.mode1
                            : theme.colors.white.mode1
                    }
                  ]}
                >
                  {isSecure && value
                    ? '•'.repeat(value.length)
                    : value || placeholder}
                </Text>
              </View>
            </ScrollView>
          ) : (
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={handleChange}
              placeholder={shouldDisplayCustomPlaceholder ? '' : placeholder}
              placeholderTextColor={colors.grey100.mode1}
              editable={!isDisabled}
              style={[
                styles.input,
                {
                  color:
                    isTransparent || isColored
                      ? 'transparent'
                      : type === 'url'
                        ? theme.colors.primary400.mode1
                        : theme.colors.white.mode1
                }
              ]}
              keyboardType={type}
              secureTextEntry={isSecure}
              onLayout={onInputLayout}
              onFocus={handleFocus}
              onBlur={handleBlur}
              accessible
              pointerEvents={isDisabled && onClick ? 'none' : 'auto'}
              numberOfLines={1}
              ellipsizeMode="tail"
              testID={testID ? `${testID}-input` : undefined}
              accessibilityLabel={inputAccessibilityLabel}
            />
          )}

          {shouldDisplayCustomPlaceholder && !value && (
            <View style={styles.customPlaceholder} pointerEvents="none">
              <Text numberOfLines={1} style={styles.customPlaceholderText}>
                {placeholder}
              </Text>
            </View>
          )}

          {isColored && (
            <View style={styles.styledTextContainer} pointerEvents="none">
              <HighlightString
                numberOfLines={1}
                fontWeight={700}
                text={value}
              />
            </View>
          )}
        </View>

        {!!error?.length && (
          <View style={styles.errorMessageWrapper}>
            <ErrorIcon size="10" />
            <Text style={styles.errorMessage}> {error} </Text>
          </View>
        )}
      </View>
      {(!!additionalItems || (isDisabled && onClick)) && (
        <View style={styles.additionalItems}>
          {additionalItems}
          {isDisabled && onClick && (
            <TouchableOpacity onPress={onClick} activeOpacity={0.7}>
              <CopyIcon size="20" color={theme.colors.white.mode1} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )

  if (isDisabled && onClick) {
    return (
      <View
        style={getWrapperStyle()}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
      >
        {InputContent}
        {!!belowInputContent && belowInputContent}
      </View>
    )
  }

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={getWrapperStyle()}
      accessible={false}
      activeOpacity={1}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {InputContent}
      {!!belowInputContent && belowInputContent}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%'
  },
  outlineWrapper: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  defaultWrapper: {},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  iconWrapper: {
    flexShrink: 0
  },
  mainWrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: colors.white.mode1
  },
  inputContainer: {
    flex: 1,
    marginTop: 5,
    minHeight: 29
  },
  scrollableTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 29
  },
  input: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    ...(Platform.OS === 'android' && {
      paddingVertical: 0,
      textAlignVertical: 'center'
    })
  },
  styledTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    overflow: 'hidden',
    flex: 1
  },
  errorMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2
  },
  errorMessage: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '500',
    color: colors.categoryIdentity.mode1
  },
  additionalItems: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'center'
  },
  customPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 5,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  customPlaceholderText: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: colors.grey100.mode1,
    ...(Platform.OS === 'android' && {
      includeFontPadding: false,
      textAlignVertical: 'center'
    })
  }
})
