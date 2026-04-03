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

export const VaultRenameScreen = ({ route }) => {
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

  const [name, setName] = useState(currentVaultName || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [isProtected, setIsProtected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isNameFocused, setIsNameFocused] = useState(true)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  useEffect(() => {
    if (currentVaultName) {
      setName(currentVaultName)
    }
  }, [currentVaultName])

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

  const trimmedName = name.trim()
  const isUnchanged = trimmedName === (currentVaultName || '').trim()
  const canSubmit =
    trimmedName.length > 0 &&
    !isUnchanged &&
    (!isProtected || currentPassword.length > 0)

  const inputActive = useMemo(
    () => isNameFocused || trimmedName.length > 0,
    [isNameFocused, trimmedName.length]
  )

  const handleSave = async () => {
    if (!canSubmit || !vaultId) {
      return
    }

    try {
      setIsLoading(true)
      Keyboard.dismiss()

      if (isProtected) {
        await updateProtectedVault(vaultId, {
          name: trimmedName,
          currentPassword
        })
      } else {
        await updateUnprotectedVault(vaultId, {
          name: trimmedName
        })
      }

      Toast.show({
        type: 'baseToast',
        text1: t`Vault renamed`,
        position: 'bottom',
        bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
      })
      navigation.goBack()
    } catch (error) {
      logger.error('Error renaming vault:', error)
      Toast.show({
        type: 'baseToast',
        text1: isProtected
          ? t`Invalid vault password`
          : t`Could not rename vault`,
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
          <LinearGradient id="vaultRenameBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#080A05" />
            <Stop offset="100%" stopColor="#15180E" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#vaultRenameBg)"
        />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.contentWindow}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              testID="rename-vault-back-button"
            >
              <BackIcon size={20} color={colors.white?.mode1 || '#FFFFFF'} />
            </TouchableOpacity>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t`Rename Vault`}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            <View
              style={[
                styles.inputWrapper,
                inputActive && styles.inputWrapperActive
              ]}
            >
              <Text style={styles.inputLabel}>{t`Vault Name`}</Text>
              <TextInput
                testID="rename-vault-name-input"
                accessibilityLabel="rename-vault-name-input"
                placeholder={t`Enter Name`}
                placeholderTextColor="#BDC3AC"
                value={name}
                onChangeText={setName}
                style={styles.input}
                returnKeyType={isProtected ? 'next' : 'done'}
                onSubmitEditing={handleSave}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
              />
            </View>

            {isProtected && (
              <View
                style={[
                  styles.passwordField,
                  isPasswordFocused && styles.passwordFieldFocused
                ]}
              >
                <View style={styles.passwordCopy}>
                  <Text style={styles.passwordLabel}>
                    {t`Current Password`}
                  </Text>
                  <TextInput
                    testID="rename-vault-current-password-input"
                    accessibilityLabel="rename-vault-current-password-input"
                    placeholder={t`Enter vault password`}
                    placeholderTextColor="#BDC3AC"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!isPasswordVisible}
                    style={styles.passwordInput}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onSubmitEditing={handleSave}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible((current) => !current)}
                  style={styles.visibilityButton}
                  testID="rename-vault-current-password-visibility"
                >
                  {isPasswordVisible ? (
                    <EyeClosedIcon size={14} color="#BDC3AC" />
                  ) : (
                    <EyeIcon size={14} color="#BDC3AC" />
                  )}
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.filler} />
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              stretch
              disabled={!canSubmit || isLoading}
              onPress={handleSave}
              testID="rename-vault-save-button"
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#212814',
    backgroundColor: '#212814',
    padding: 12,
    gap: 2
  },
  inputWrapperActive: {
    borderColor: '#B0D944',
    shadowColor: '#B0D944',
    shadowOpacity: 0.35,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 }
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
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#212814',
    backgroundColor: '#15180E'
  },
  passwordFieldFocused: {
    borderColor: '#B0D944'
  },
  passwordCopy: {
    flex: 1,
    gap: 2
  },
  passwordLabel: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  passwordInput: {
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
    borderTopColor: '#212814',
    backgroundColor: '#15180E'
  }
})
