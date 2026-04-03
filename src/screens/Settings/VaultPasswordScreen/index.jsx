import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  BackIcon,
  EyeClosedIcon,
  EyeIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useVault } from '@tetherto/pearpass-lib-vault'
import { validatePasswordChange } from '@tetherto/pearpass-utils-password-check'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../../../constants/toast'
import { ButtonPrimary } from '../../../libComponents'
import { logger } from '../../../utils/logger'

export const VaultPasswordScreen = ({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const {
    data: vault,
    isVaultProtected,
    updateProtectedVault,
    updateUnprotectedVault
  } = useVault()

  const vaultId = route?.params?.vaultId || vault?.id
  const currentVaultName =
    vault?.id === vaultId ? vault?.name : route?.params?.vaultName

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [isProtected, setIsProtected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrentPasswordFocused, setIsCurrentPasswordFocused] =
    useState(false)
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(true)
  const [isRepeatPasswordFocused, setIsRepeatPasswordFocused] = useState(false)
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)
  const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false)

  const passwordErrors = useMemo(
    () => ({
      minLength: t`Password must be at least 8 characters long`,
      hasLowerCase: t`Password must contain at least one lowercase letter`,
      hasUpperCase: t`Password must contain at least one uppercase letter`,
      hasNumbers: t`Password must contain at least one number`,
      hasSymbols: t`Password must contain at least one special character`
    }),
    [t]
  )

  useEffect(() => {
    const checkProtection = async () => {
      if (!vaultId) {
        return
      }

      const result = await isVaultProtected(vaultId)
      setIsProtected(result)
    }

    checkProtection()
  }, [isVaultProtected, vaultId])

  const canSubmit =
    newPassword.length > 0 &&
    repeatPassword.length > 0 &&
    (!isProtected || currentPassword.length > 0)

  const handleSave = async () => {
    if (!canSubmit || !vaultId) {
      return
    }

    const validation = validatePasswordChange({
      currentPassword,
      newPassword,
      repeatPassword,
      messages: {
        newPasswordMustDiffer: t`New password must be different from the current password`,
        passwordsDontMatch: t`Passwords do not match`
      },
      config: {
        errors: passwordErrors
      }
    })

    if (!validation.success) {
      Toast.show({
        type: 'baseToast',
        text1: validation.error || t`Password is invalid`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
      return
    }

    try {
      setIsLoading(true)
      Keyboard.dismiss()

      if (isProtected) {
        await updateProtectedVault(vaultId, {
          name: currentVaultName,
          password: newPassword,
          currentPassword
        })
      } else {
        await updateUnprotectedVault(vaultId, {
          name: currentVaultName,
          password: newPassword
        })
      }

      Toast.show({
        type: 'baseToast',
        text1: t`Vault password updated`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
      navigation.goBack()
    } catch (error) {
      logger.error('Error updating vault password:', error)
      Toast.show({
        type: 'baseToast',
        text1: isProtected
          ? t`Invalid vault password`
          : t`Could not update vault password`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="vaultPasswordBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#080A05" />
            <Stop offset="100%" stopColor="#15180E" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#vaultPasswordBg)"
        />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.contentWindow}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              testID="vault-password-back-button"
            >
              <BackIcon size={20} color={colors.white?.mode1 || '#FFFFFF'} />
            </TouchableOpacity>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t`Set Vault Password`}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            {isProtected && (
              <View
                style={[
                  styles.inputWrapper,
                  (isCurrentPasswordFocused || currentPassword.length > 0) &&
                    styles.inputWrapperActive
                ]}
              >
                <View style={styles.inputCopy}>
                  <Text style={styles.inputLabel}>{t`Current Password`}</Text>
                  <TextInput
                    testID="vault-password-current-input"
                    accessibilityLabel="vault-password-current-input"
                    placeholder={t`Enter Vault Password`}
                    placeholderTextColor="#BDC3AC"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!isCurrentPasswordVisible}
                    style={styles.input}
                    returnKeyType="next"
                    onSubmitEditing={handleSave}
                    onFocus={() => setIsCurrentPasswordFocused(true)}
                    onBlur={() => setIsCurrentPasswordFocused(false)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setIsCurrentPasswordVisible((current) => !current)
                  }
                  style={styles.visibilityButton}
                  testID="vault-password-current-visibility"
                >
                  {isCurrentPasswordVisible ? (
                    <EyeClosedIcon size={14} color="#BDC3AC" />
                  ) : (
                    <EyeIcon size={14} color="#BDC3AC" />
                  )}
                </TouchableOpacity>
              </View>
            )}

            <View
              style={[
                styles.inputWrapper,
                (isNewPasswordFocused || newPassword.length > 0) &&
                  styles.inputWrapperActive
              ]}
            >
              <View style={styles.inputCopy}>
                <Text style={styles.inputLabel}>{t`Password`}</Text>
                <TextInput
                  testID="vault-password-new-input"
                  accessibilityLabel="vault-password-new-input"
                  placeholder={t`Enter Vault Password`}
                  placeholderTextColor="#BDC3AC"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!isNewPasswordVisible}
                  style={styles.input}
                  returnKeyType="next"
                  onSubmitEditing={handleSave}
                  onFocus={() => setIsNewPasswordFocused(true)}
                  onBlur={() => setIsNewPasswordFocused(false)}
                />
              </View>
              <TouchableOpacity
                onPress={() => setIsNewPasswordVisible((current) => !current)}
                style={styles.visibilityButton}
                testID="vault-password-new-visibility"
              >
                {isNewPasswordVisible ? (
                  <EyeClosedIcon size={14} color="#BDC3AC" />
                ) : (
                  <EyeIcon size={14} color="#BDC3AC" />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputWrapper,
                (isRepeatPasswordFocused || repeatPassword.length > 0) &&
                  styles.inputWrapperActive,
                repeatPassword.length > 0 &&
                  repeatPassword !== newPassword &&
                  styles.inputWrapperError
              ]}
            >
              <View style={styles.inputCopy}>
                <Text style={styles.inputLabel}>{t`Repeat Password`}</Text>
                <TextInput
                  testID="vault-password-repeat-input"
                  accessibilityLabel="vault-password-repeat-input"
                  placeholder={t`Repeat Vault Password`}
                  placeholderTextColor="#BDC3AC"
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                  secureTextEntry={!isRepeatPasswordVisible}
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  onFocus={() => setIsRepeatPasswordFocused(true)}
                  onBlur={() => setIsRepeatPasswordFocused(false)}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  setIsRepeatPasswordVisible((current) => !current)
                }
                style={styles.visibilityButton}
                testID="vault-password-repeat-visibility"
              >
                {isRepeatPasswordVisible ? (
                  <EyeClosedIcon size={14} color="#BDC3AC" />
                ) : (
                  <EyeIcon size={14} color="#BDC3AC" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.filler} />
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              stretch
              disabled={!canSubmit || isLoading}
              onPress={handleSave}
              testID="vault-password-save-button"
            >
              {t`Save`}
            </ButtonPrimary>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  contentWindow: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 16
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    flex: 1,
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500'
  },
  headerSpacer: {
    width: 40
  },
  content: {
    flex: 1,
    backgroundColor: '#15180E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: '#212814',
    padding: 16,
    gap: 12
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#212814',
    backgroundColor: '#15180E',
    padding: 12
  },
  inputWrapperActive: {
    backgroundColor: '#212814',
    borderColor: '#B0D944',
    shadowColor: '#B0D944',
    shadowOpacity: 0.35,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 }
  },
  inputWrapperError: {
    borderColor: '#F87171'
  },
  inputCopy: {
    flex: 1,
    gap: 2
  },
  inputLabel: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  input: {
    minHeight: 20,
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    padding: 0
  },
  visibilityButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filler: {
    flex: 1
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2C3618',
    backgroundColor: '#15180E'
  }
})
