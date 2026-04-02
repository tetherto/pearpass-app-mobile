import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  BackIcon,
  EyeClosedIcon,
  EyeIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { ButtonPrimary } from '../../../libComponents'

export const StepIdentity = ({ initialData, onSubmit, onBack }) => {
  const { t } = useLingui()

  const [name, setName] = useState(initialData?.name ?? '')
  const [usePassword, setUsePassword] = useState(
    initialData?.usePassword ?? false
  )
  const [password, setPassword] = useState(initialData?.password ?? '')
  const [passwordConfirm, setPasswordConfirm] = useState(
    initialData?.passwordConfirm ?? ''
  )
  const [isNameFocused, setIsNameFocused] = useState(true)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isPasswordConfirmFocused, setIsPasswordConfirmFocused] =
    useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false)

  const trimmedName = name.trim()
  const passwordsMismatch =
    usePassword && passwordConfirm.length > 0 && password !== passwordConfirm
  const canSubmit =
    trimmedName.length > 0 &&
    (!usePassword ||
      (password.length > 0 &&
        passwordConfirm.length > 0 &&
        password === passwordConfirm))

  const handleSubmit = () => {
    if (!canSubmit) {
      return
    }

    Keyboard.dismiss()
    onSubmit({
      name: trimmedName,
      usePassword,
      password: usePassword ? password : '',
      passwordConfirm: usePassword ? passwordConfirm : ''
    })
  }

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="vaultWizardBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#151515" />
            <Stop offset="100%" stopColor="#15180e" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#vaultWizardBg)"
        />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.contentWindow}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={styles.backButton}
              testID="new-vault-back-button"
            >
              <BackIcon size={20} color={colors.white?.mode1 || '#FFFFFF'} />
            </TouchableOpacity>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t`Create New Vault`}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            <View
              style={[
                styles.inputWrapper,
                (isNameFocused || trimmedName.length > 0) &&
                  styles.inputWrapperActive
              ]}
            >
              <Text style={styles.inputLabel}>{t`Vault Name`}</Text>
              <TextInput
                testID="new-vault-name-input"
                accessibilityLabel="new-vault-name-input"
                placeholder={t`Enter Name`}
                placeholderTextColor="#BDC3AC"
                value={name}
                onChangeText={setName}
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
              />
            </View>

            <Pressable
              style={styles.toggleRow}
              onPress={() => {
                const nextValue = !usePassword
                setUsePassword(nextValue)
                if (!nextValue) {
                  setPassword('')
                  setPasswordConfirm('')
                }
              }}
              testID="new-vault-password-toggle"
              accessibilityRole="switch"
              accessibilityState={{ checked: usePassword }}
            >
              <View style={styles.toggleCopy}>
                <Text style={styles.toggleTitle}>{t`Set Vault Password`}</Text>
                <Text style={styles.toggleSubtitle}>
                  {t`Add extra password on top of your master password`}
                </Text>
              </View>
              <View
                style={[
                  styles.toggleTrack,
                  usePassword && styles.toggleTrackOn
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    usePassword && styles.toggleThumbOn
                  ]}
                />
              </View>
            </Pressable>

            {usePassword && (
              <View style={styles.passwordFields}>
                <View
                  style={[
                    styles.passwordField,
                    isPasswordFocused && styles.passwordFieldFocused
                  ]}
                >
                  <View style={styles.passwordCopy}>
                    <Text style={styles.passwordLabel}>{t`Password`}</Text>
                    <TextInput
                      testID="new-vault-password-input"
                      accessibilityLabel="new-vault-password-input"
                      placeholder={t`Enter vault password`}
                      placeholderTextColor="#BDC3AC"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!isPasswordVisible}
                      style={styles.passwordInput}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible((current) => !current)}
                    style={styles.visibilityButton}
                    testID="new-vault-password-visibility"
                  >
                    {isPasswordVisible ? (
                      <EyeClosedIcon size={14} color="#BDC3AC" />
                    ) : (
                      <EyeIcon size={14} color="#BDC3AC" />
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.passwordField,
                    isPasswordConfirmFocused && styles.passwordFieldFocused,
                    passwordsMismatch && styles.passwordFieldError
                  ]}
                >
                  <View style={styles.passwordCopy}>
                    <Text style={styles.passwordLabel}>
                      {t`Repeat Password`}
                    </Text>
                    <TextInput
                      testID="new-vault-password-confirm-input"
                      accessibilityLabel="new-vault-password-confirm-input"
                      placeholder={t`Repeat vault password`}
                      placeholderTextColor="#BDC3AC"
                      value={passwordConfirm}
                      onChangeText={setPasswordConfirm}
                      secureTextEntry={!isPasswordConfirmVisible}
                      style={styles.passwordInput}
                      onFocus={() => setIsPasswordConfirmFocused(true)}
                      onBlur={() => setIsPasswordConfirmFocused(false)}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setIsPasswordConfirmVisible((current) => !current)
                    }
                    style={styles.visibilityButton}
                    testID="new-vault-password-confirm-visibility"
                  >
                    {isPasswordConfirmVisible ? (
                      <EyeClosedIcon size={14} color="#BDC3AC" />
                    ) : (
                      <EyeIcon size={14} color="#BDC3AC" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.filler} />
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              stretch
              disabled={!canSubmit}
              onPress={handleSubmit}
              testID="new-vault-submit-button"
            >
              {t`Create New Vault`}
            </ButtonPrimary>
          </View>
        </View>
      </SafeAreaView>
    </View>
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
    gap: 24
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  toggleCopy: {
    flex: 1,
    gap: 4
  },
  toggleTitle: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500'
  },
  toggleSubtitle: {
    color: '#BDC3AC',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 60,
    backgroundColor: '#2C3618',
    padding: 2,
    justifyContent: 'center'
  },
  toggleTrackOn: {
    backgroundColor: '#B0D944'
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#ECF1EE'
  },
  toggleThumbOn: {
    alignSelf: 'flex-end'
  },
  passwordFields: {
    gap: 12
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
  passwordFieldError: {
    borderColor: '#F87171'
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
