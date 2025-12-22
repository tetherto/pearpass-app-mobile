import { useEffect, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { PROTECTED_VAULT_ENABLED } from 'pearpass-lib-constants'
import { SmallArrowIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useCreateVault, useVault } from 'pearpass-lib-vault'
import {
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Easing,
  Animated
} from 'react-native'

import { useKeyboardVisibility } from '../../hooks/useKeyboardVisibility'
import {
  ButtonLittle,
  ButtonPrimary,
  ButtonSecondary,
  InputPasswordPearPass
} from '../../libComponents'
import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'
import { logger } from '../../utils/logger'

export const NewVault = () => {
  const { isKeyboardVisible } = useKeyboardVisibility()

  const navigation = useNavigation()
  const { t } = useLingui()

  const [isLoading, setIsLoading] = useState(false)

  const animatedHeight = useRef(new Animated.Value(0)).current
  const animatedDegree = useRef(new Animated.Value(0)).current
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const { createVault } = useCreateVault()
  const { addDevice, refetch: refetchVault } = useVault()

  const schema = Validator.object({
    name: Validator.string().required(t`Name is required`),
    password: Validator.string(),
    passwordConfirm: Validator.string()
  })

  const { register, handleSubmit, setErrors } = useForm({
    initialValues: { name: '' },
    validate: (values) => schema.validate(values)
  })

  const onSubmit = async (values) => {
    if (values.password !== values.passwordConfirm) {
      setErrors({ passwordConfirm: t`Passwords do not match` })
      return
    }
    try {
      setIsLoading(true)
      await createVault({ name: values.name, password: values.password })
      await addDevice(Platform.OS + ' ' + Platform.Version)
      navigation.replace('MainTabNavigator')
      setIsLoading(false)
    } catch (error) {
      logger.error('Error creating vault:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refetchVault()
  }, [])

  const toggle = () => {
    Animated.timing(animatedHeight, {
      toValue: isPasswordVisible ? 0 : 165,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false
    }).start()
    Animated.timing(animatedDegree, {
      toValue: isPasswordVisible ? 0 : 180,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false
    }).start()
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <KeyboardAvoidingView
      testID="new-vault-screen"
      accessibilityLabel="new-vault-screen"
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        {!isKeyboardVisible && (
          <View style={styles.logoContainer}>
            <LogoTextWithLock width={170} height={50} />
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <View style={styles.headerBlock}>
              <Text style={styles.title} testID="new-vault-title" accessibilityLabel="new-vault-title">{t`Create New Vault`}</Text>
              <Text
                style={styles.subtitle} testID="new-vault-subtitle" accessibilityLabel="new-vault-subtitle"
              >{t`Create your first vault by giving it a name. You can also add a password to secure this vault for extra protection.`}</Text>
            </View>

            <View style={styles.inputs}>
              <InputPasswordPearPass
                testID="new-vault-name-input"
                accessibilityLabel="new-vault-name-input"
                placeholder={t`Enter Name`}
                {...register('name')}
              />
            </View>
            {PROTECTED_VAULT_ENABLED && (
              <View style={styles.inputs}>
                <View style={styles.dropdownLabel}>
                  <Text
                    style={styles.label}
                  >{t`Set Vault password (optional)`}</Text>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: animatedDegree.interpolate({
                            inputRange: [0, 180],
                            outputRange: ['0deg', '180deg']
                          })
                        }
                      ]
                    }}
                  >
                    <ButtonLittle
                      testID="new-vault-toggle-password-section"
                      accessibilityLabel="new-vault-toggle-password-section"
                      onPress={toggle}
                      variant="secondary"
                      borderRadius="lg"
                      startIcon={SmallArrowIcon}
                    />
                  </Animated.View>
                </View>

                <Animated.View
                  style={{
                    overflow: 'hidden',
                    height: animatedHeight,
                    gap: 25
                  }}
                >
                  <InputPasswordPearPass
                    testID="new-vault-password-input"
                    accessibilityLabel="new-vault-password-input"
                    placeholder={t`Enter Password`}
                    {...register('password')}
                    isPassword
                  />

                  <View style={{ gap: 10 }}>
                    <Text style={styles.label}>{t`Repeat Vault password`}</Text>
                    <InputPasswordPearPass
                      testID="new-vault-confirm-password-input"
                      accessibilityLabel="new-vault-confirm-password-input"
                      placeholder={t`Confirm Password`}
                      {...register('passwordConfirm')}
                      isPassword
                    />
                  </View>
                </Animated.View>
              </View>
            )}
            <View style={styles.buttons}>
              {isLoading ? (
                <ActivityIndicator
                  testID="new-vault-loading"
                  accessibilityLabel="new-vault-loading"
                  size="small"
                  color={colors.primary400.mode1}
                />
              ) : (
                <>
                  <ButtonPrimary testID="new-vault-continue-button" accessibilityLabel="new-vault-continue-button" stretch onPress={handleSubmit(onSubmit)}>
                    <Text testID="new-vault-continue-text" accessibilityLabel="new-vault-continue-text">{t`Continue`}</Text>
                  </ButtonPrimary>
                  <ButtonSecondary
                    testID="new-vault-select-vaults-button"
                    accessibilityLabel="new-vault-select-vaults-button"
                    stretch
                    onPress={() =>
                      navigation.navigate('Welcome', { state: 'selectOrLoad' })
                    }
                  >
                    <Text testID="new-vault-select-vaults-text" accessibilityLabel="new-vault-select-vaults-text">{t`Select Vaults`}</Text>
                  </ButtonSecondary>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  logoContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 140
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 20
  },
  headerBlock: { alignItems: 'center', marginBottom: 20, gap: 10 },
  title: {
    color: colors.white.mode1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700'
  },
  subtitle: {
    color: colors.white.mode1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 30
  },
  inputs: { width: '100%', gap: 15 },
  buttons: { width: '100%', gap: 10, marginTop: 20 },
  dropdownLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500'
  }
})
