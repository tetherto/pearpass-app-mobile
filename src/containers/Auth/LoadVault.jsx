import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { QrCodeIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { usePair, useVault } from 'pearpass-lib-vault'
import {
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet
} from 'react-native'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useKeyboardVisibility } from '../../hooks/useKeyboardVisibility'
import {
  ButtonPrimary,
  ButtonSecondary,
  InputPasswordPearPass
} from '../../libComponents'
import { LogoTextWithLock } from '../../svgs/LogoTextWithLock'
import { BottomSheetQrScannerContent } from '../BottomSheetQrScannerContent'

export const LoadVault = () => {
  const { isKeyboardVisible } = useKeyboardVisibility()

  const navigation = useNavigation()
  const { t } = useLingui()

  const { expand, collapse } = useBottomSheet()

  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const { refetch: refetchVault, addDevice } = useVault()
  const { pairActiveVault, cancelPairActiveVault, isLoading } = usePair()

  const pairWithCode = async (code) => {
    try {
      const vaultId = await pairActiveVault(code)
      const vault = await refetchVault(vaultId)
      await addDevice(Platform.OS + ' ' + Platform.Version)
      if (vault) navigation.replace('MainTabNavigator')
    } catch {
      setError(t`Something went wrong, please check invite code`)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ flex: 1 }}>
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
            <View style={{ marginBottom: 20, alignItems: 'center', gap: 10 }}>
              <Text
                style={styles.title}
                testID="load-vault-title"
              >{t`Import an existing vault`}</Text>
              <Text
                style={styles.subtitle}
                testID="load-vault-subtitle"
              >{t`Using PearPass on your other device, use "Add Device" to generate a QR or connection code to pair your vault. This method keeps your vault secure.`}</Text>
            </View>

            <View style={{ width: '100%', gap: 15 }}>
              <InputPasswordPearPass
                testID="load-vault-invite-code-input"
                placeholder={t`Insert vault key...`}
                value={inviteCode}
                onChange={setInviteCode}
                error={error}
              />
            </View>

            <View style={{ width: '100%', gap: 10, marginTop: 10 }}>
              {isLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={colors.primary400.mode1}
                  />
                  <ButtonSecondary stretch onPress={cancelPairActiveVault}>
                    {t`Cancel Pairing`}
                  </ButtonSecondary>
                </>
              ) : (
                <>
                  <ButtonPrimary
                    testID="load-vault-open-button"
                    onPress={() => pairWithCode(inviteCode)}
                    stretch
                    disabled={!inviteCode.length || isLoading}
                  >
                    {t`Import vault`}
                  </ButtonPrimary>

                  <ButtonSecondary
                    testID="load-vault-select-vaults-button"
                    stretch
                    onPress={() =>
                      navigation.navigate('Welcome', { state: 'selectOrLoad' })
                    }
                  >
                    {t`Select Vaults`}
                  </ButtonSecondary>

                  <Pressable
                    style={styles.qrCodeButton}
                    onPress={() =>
                      expand({
                        children: (
                          <BottomSheetQrScannerContent
                            onScanned={(code) => {
                              pairWithCode(code)
                              collapse()
                            }}
                          />
                        ),
                        snapPoints: ['10%', '75%', '75%']
                      })
                    }
                    testID="load-vault-scan-qr-button"
                  >
                    <QrCodeIcon size="21" color={colors.primary400.mode1} />
                    <Text style={styles.qrCodeText}>{t`Scan QR Code`}</Text>
                  </Pressable>
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
    fontWeight: '400'
  },
  qrCodeButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    alignSelf: 'center',
    marginTop: 10
  },
  qrCodeText: {
    color: colors.primary400.mode1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '400'
  }
})
