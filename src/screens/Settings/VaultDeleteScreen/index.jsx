import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
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

import { AppWarning } from '../../../components/AppWarning'
import { TOAST_CONFIG } from '../../../constants/toast'
import { ButtonPrimary } from '../../../libComponents'

export const VaultDeleteScreen = ({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()

  const vaultName = route?.params?.vaultName || t`Personal Vault`

  const [masterPassword, setMasterPassword] = useState('')
  const [isFocused, setIsFocused] = useState(true)

  const canSubmit = masterPassword.trim().length > 0

  const handleDelete = () => {
    if (!canSubmit) {
      return
    }

    Keyboard.dismiss()
    Toast.show({
      type: 'baseToast',
      text1: t`Vault deletion is not yet connected on mobile`,
      position: 'bottom',
      bottomOffset: TOAST_CONFIG.BOTTOM_OFFSET
    })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="vaultDeleteBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#080A05" />
            <Stop offset="100%" stopColor="#15180E" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#vaultDeleteBg)"
        />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.contentWindow}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              testID="vault-delete-back-button"
            >
              <BackIcon size={20} color={colors.white?.mode1 || '#FFFFFF'} />
            </TouchableOpacity>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t`Delete Personal Vault`}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>
              {t`Are you sure you want to delete “${vaultName}”? All items in this vault will be permanently deleted. This cannot be undone.`}
            </Text>

            <View
              style={[
                styles.inputWrapper,
                (isFocused || masterPassword.length > 0) &&
                  styles.inputWrapperActive
              ]}
            >
              <Text style={styles.inputLabel}>
                {t`Confirm With Master Password`}
              </Text>
              <TextInput
                testID="vault-delete-master-password-input"
                accessibilityLabel="vault-delete-master-password-input"
                placeholder={t`Enter Master Password to Confirm Deletion`}
                placeholderTextColor="#BDC3AC"
                value={masterPassword}
                onChangeText={setMasterPassword}
                secureTextEntry
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleDelete}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            <AppWarning
              warning={t`Deleting this vault permanently removes all data on this device. Vault deletion remains blocked until mobile SDK support is available.`}
              containerStyles={styles.warningContainer}
              textStyles={styles.warningText}
              testID="vault-delete-warning"
            />

            <View style={styles.filler} />
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              stretch
              disabled={!canSubmit}
              onPress={handleDelete}
              testID="vault-delete-submit-button"
            >
              {t`Delete Vault`}
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
  description: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20
  },
  inputWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#212814',
    backgroundColor: '#15180E',
    padding: 12,
    gap: 2
  },
  inputWrapperActive: {
    backgroundColor: '#212814',
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
  warningContainer: {
    backgroundColor: '#2F260E',
    borderColor: '#FFAE00',
    padding: 12
  },
  warningText: {
    color: '#F6F6F6',
    lineHeight: 20
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
