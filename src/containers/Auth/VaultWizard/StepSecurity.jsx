import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { AppSwitch } from '../../../components/AppSwitch/AppSwitch'
import {
  ButtonPrimary,
  ButtonSecondary,
  InputPasswordPearPass
} from '../../../libComponents'
import {
  getVaultPasswordStrengthMeta,
  getVaultScreenState
} from '../../../utils/vaultFlow'

export const StepSecurity = ({ initialData, onNext, onBack }) => {
  const { t } = useLingui()
  const [usePassword, setUsePassword] = useState(initialData.usePassword)
  const [password, setPassword] = useState(initialData.password)
  const [passwordConfirm, setPasswordConfirm] = useState(
    initialData.passwordConfirm
  )
  const [didTryContinue, setDidTryContinue] = useState(false)

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

  const strengthMeta = useMemo(
    () => getVaultPasswordStrengthMeta(password, passwordErrors),
    [password, passwordErrors]
  )

  const validationErrors = useMemo(() => {
    if (!didTryContinue) {
      return {}
    }

    if (!usePassword) {
      return {}
    }

    const nextErrors = {}

    if (!password.length) {
      nextErrors.password = t`Vault password is required when this extra layer is enabled`
    } else if (!strengthMeta.result?.success) {
      nextErrors.password =
        strengthMeta.result?.errors?.[0] || t`Vault password is too weak`
    }

    if (!passwordConfirm.length) {
      nextErrors.passwordConfirm = t`Repeat your vault password`
    } else if (password !== passwordConfirm) {
      nextErrors.passwordConfirm = t`Passwords do not match`
    }

    return nextErrors
  }, [
    didTryContinue,
    password,
    passwordConfirm,
    strengthMeta.result,
    t,
    usePassword
  ])

  const canContinue = !usePassword
    ? true
    : strengthMeta.result?.success && password === passwordConfirm

  const screenState = getVaultScreenState({
    hasValue: usePassword
      ? password.length > 0 || passwordConfirm.length > 0
      : true,
    hasError: Object.keys(validationErrors).length > 0,
    isValid: canContinue,
    isTouched:
      didTryContinue ||
      usePassword !== initialData.usePassword ||
      password.length > 0
  })

  const ruleStates = strengthMeta.result?.rules || {
    minLength: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumbers: false,
    hasSymbols: false
  }

  const handleContinue = () => {
    setDidTryContinue(true)

    if (!canContinue) {
      return
    }

    onNext({
      usePassword,
      password: usePassword ? password : '',
      passwordConfirm: usePassword ? passwordConfirm : ''
    })
  }

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient
            id="vaultWizardSecurityBg"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop offset="0%" stopColor="#0A0E06" />
            <Stop offset="100%" stopColor="#15180E" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#vaultWizardSecurityBg)"
        />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.headerBlock}>
              <Text style={styles.stepIndicator}>{t`STEP 2 OF 3`}</Text>
              <View style={styles.progressTrack}>
                {[0, 1, 2].map((index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressSegment,
                      index < 2 && styles.progressSegmentActive
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.title}>{t`Set Vault Security`}</Text>
              <Text style={styles.subtitle}>
                {t`A vault password adds a separate encryption layer on top of your master password.`}
              </Text>
            </View>

            <View style={styles.securitySection}>
              <View
                style={[
                  styles.toggleContainer,
                  usePassword && styles.toggleContainerActive
                ]}
              >
                <View style={styles.toggleCopy}>
                  <Text style={styles.toggleLabel}>
                    {t`Set Vault Password`}
                  </Text>
                  <Text style={styles.toggleDescription}>
                    {t`Add extra password on top of your master password`}
                  </Text>
                </View>
                <AppSwitch
                  testID="new-vault-password-toggle"
                  accessibilityLabel={t`Set Vault Password`}
                  value={usePassword}
                  onChange={(value) => {
                    setUsePassword(value)
                    if (!value) {
                      setPassword('')
                      setPasswordConfirm('')
                    }
                  }}
                  trackColorTrue="#B0D944"
                  trackColorFalse="#2C3618"
                  thumbColor="#ECF1EE"
                />
              </View>

              {usePassword ? (
                <View
                  style={[
                    styles.securityCard,
                    screenState === 'error' && styles.securityCardError,
                    screenState === 'success' && styles.securityCardSuccess
                  ]}
                >
                  <InputPasswordPearPass
                    testID="new-vault-password-input"
                    errorTestID="new-vault-password-input-error"
                    placeholder={t`Enter vault password`}
                    value={password}
                    onChange={setPassword}
                    error={validationErrors.password}
                    isPassword
                  />

                  <InputPasswordPearPass
                    testID="new-vault-password-confirm-input"
                    errorTestID="new-vault-password-confirm-input-error"
                    placeholder={t`Repeat vault password`}
                    value={passwordConfirm}
                    onChange={setPasswordConfirm}
                    error={validationErrors.passwordConfirm}
                    isPassword
                  />

                  <View style={styles.strengthWrapper}>
                    <View style={styles.strengthHeader}>
                      <Text style={styles.strengthLabel}>
                        {t`Password strength`}
                      </Text>
                      <Text
                        style={[
                          styles.strengthValue,
                          { color: strengthMeta.color }
                        ]}
                      >
                        {strengthMeta.result?.strengthText
                          ? t(strengthMeta.result.strengthText)
                          : t`Not set`}
                      </Text>
                    </View>
                    <View style={styles.strengthTrack}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: `${strengthMeta.progress * 100}%`,
                            backgroundColor: strengthMeta.color
                          }
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.rulesGrid}>
                    {[
                      { key: 'minLength', label: t`8+ characters` },
                      { key: 'hasLowerCase', label: t`Lowercase` },
                      { key: 'hasUpperCase', label: t`Uppercase` },
                      { key: 'hasNumbers', label: t`Number` },
                      { key: 'hasSymbols', label: t`Symbol` }
                    ].map((rule) => (
                      <View
                        key={rule.key}
                        style={[
                          styles.ruleChip,
                          ruleStates[rule.key] && styles.ruleChipActive
                        ]}
                      >
                        <Text
                          style={[
                            styles.ruleChipText,
                            ruleStates[rule.key] && styles.ruleChipTextActive
                          ]}
                        >
                          {rule.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.noticeCard}>
                  <Text style={styles.noticeTitle}>
                    {t`Master password only`}
                  </Text>
                  <Text style={styles.noticeText}>
                    {t`You can keep this vault lightweight now and add a dedicated vault password later from vault settings.`}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.buttons}>
              <ButtonPrimary
                stretch
                onPress={handleContinue}
                disabled={usePassword && !password.length}
              >
                {t`Continue`}
              </ButtonPrimary>
              <ButtonSecondary stretch onPress={onBack}>
                {t`Back`}
              </ButtonSecondary>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32
  },
  formContainer: {
    width: '100%',
    gap: 20
  },
  headerBlock: { gap: 10 },
  stepIndicator: {
    color: colors.primary400?.mode1 || '#A3E635',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 8
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)'
  },
  progressSegmentActive: {
    backgroundColor: colors.primary400?.mode1 || '#A3E635'
  },
  title: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 22
  },
  securitySection: {
    gap: 12,
    backgroundColor: '#212814',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#212814'
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  toggleContainerActive: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3618',
    gap: 16
  },
  toggleCopy: {
    flex: 1,
    gap: 4
  },
  toggleLabel: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500'
  },
  toggleDescription: {
    color: '#BDC3AC',
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 15
  },
  securityCard: {
    gap: 12,
    backgroundColor: '#15180E',
    borderWidth: 1,
    borderColor: '#212814',
    borderRadius: 8,
    padding: 12
  },
  securityCardError: {
    borderColor: '#F87171'
  },
  securityCardSuccess: {
    borderColor: '#B0D944'
  },
  strengthWrapper: {
    gap: 8
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  strengthLabel: {
    color: 'rgba(255,255,255,0.68)',
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '600'
  },
  strengthValue: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  strengthTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#202614',
    overflow: 'hidden'
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999
  },
  rulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  ruleChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0D1009',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  ruleChipActive: {
    backgroundColor: 'rgba(163,230,53,0.14)',
    borderColor: 'rgba(163,230,53,0.35)'
  },
  ruleChipText: {
    color: 'rgba(255,255,255,0.58)',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600'
  },
  ruleChipTextActive: {
    color: colors.primary400?.mode1 || '#A3E635'
  },
  noticeCard: {
    gap: 8,
    backgroundColor: '#15180E',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#212814'
  },
  noticeTitle: {
    color: colors.white?.mode1 || '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700'
  },
  noticeText: {
    color: 'rgba(255,255,255,0.64)',
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 20
  },
  buttons: { gap: 10, marginTop: 6 }
})
