import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  AUTO_LOCK_TIMEOUT_OPTIONS,
  UNSUPPORTED
} from '@tetherto/pearpass-lib-constants'
import {
  Button,
  ContextMenu,
  NavbarListItem,
  PageHeader,
  Text,
  ToggleSwitch,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Check,
  ExpandMore,
  InfoOutlined,
  Key,
  MoreVert,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import * as SecureStore from 'expo-secure-store'
import { AppState, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SECURE_STORAGE_KEYS } from '../../../constants/secureStorageKeys'
import { SheetHeader } from '../../../containers/BottomSheet/SheetHeader'
import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useBiometricsAuthentication } from '../../../hooks/useBiometricsAuthentication'
import { usePasswordChangeReminder } from '../../../hooks/usePasswordChangeReminder'
import {
  isAutofillEnabled as checkAutofillEnabled,
  openAutofillSettings,
  requestToEnableAutofill
} from '../../../utils/AutofillModule'

const DEFAULT_CLIPBOARD_TIMEOUT = 60000

export const AppPreferences = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { expand, collapse } = useBottomSheet()
  const { autoLockTimeout, setAutoLockTimeout } = useAutoLockContext()
  const { isPasswordChangeReminderEnabled } = usePasswordChangeReminder()
  const { isBiometricsSupported, isBiometricsEnabled, toggleBiometrics } =
    useBiometricsAuthentication()
  const { bottom } = useSafeAreaInsets()

  const [isAutofillEnabled, setIsAutofillEnabled] = useState(false)
  const [clipboardClearTimeout, setClipboardClearTimeout] = useState(
    DEFAULT_CLIPBOARD_TIMEOUT
  )
  const [isNonSecureAllowed, setIsNonSecureAllowed] = useState(false)
  const [isPinEnabled, setIsPinEnabled] = useState(false)
  const [isRemindersEnabled, setIsRemindersEnabled] = useState(true)
  const appStateRef = useRef(AppState.currentState)

  const clipboardTimeoutOptions = useMemo(
    () => [
      { label: t`1 Minute`, value: 60000 },
      { label: t`3 Minutes`, value: 180000 },
      { label: t`5 Minutes`, value: 300000 },
      { label: t`10 Minutes`, value: 600000 },
      { label: t`30 Minutes`, value: 1800000 },
      { label: t`1 Hour`, value: 3600000 },
      { label: t`3 Hours`, value: 10800000 },
      { label: t`Never`, value: null }
    ],
    [t]
  )

  const autoLockOptions = useMemo(
    () =>
      Object.values(AUTO_LOCK_TIMEOUT_OPTIONS).map((option) => ({
        label: t(option.label),
        value: option.value
      })),
    [t]
  )

  const refreshAutofillStatus = useCallback(async () => {
    const enabled = await checkAutofillEnabled()
    setIsAutofillEnabled(enabled)
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      const [clipTimeout, nonSecure, pin] = await Promise.all([
        SecureStore.getItemAsync(SECURE_STORAGE_KEYS.CLIPBOARD_CLEAR_TIMEOUT),
        SecureStore.getItemAsync(SECURE_STORAGE_KEYS.ALLOW_NON_SECURE_WEBSITES),
        SecureStore.getItemAsync(SECURE_STORAGE_KEYS.PIN_ENABLED)
      ])

      if (clipTimeout === 'null') {
        setClipboardClearTimeout(null)
      } else if (clipTimeout !== null) {
        setClipboardClearTimeout(Number(clipTimeout))
      }
      setIsNonSecureAllowed(nonSecure === 'true')
      setIsPinEnabled(pin === 'true')
      setIsRemindersEnabled(isPasswordChangeReminderEnabled)
    }

    refreshAutofillStatus()
    loadSettings()
  }, [isPasswordChangeReminderEnabled, refreshAutofillStatus])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        refreshAutofillStatus()
      }
      appStateRef.current = nextAppState
    })

    return () => subscription.remove()
  }, [refreshAutofillStatus])

  const handleAutofillToggle = useCallback(async () => {
    if (isAutofillEnabled) {
      await openAutofillSettings()
    } else {
      await requestToEnableAutofill()
    }
  }, [isAutofillEnabled])

  const handleNonSecureToggle = useCallback(async (checked) => {
    setIsNonSecureAllowed(checked)
    if (checked) {
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.ALLOW_NON_SECURE_WEBSITES,
        'true'
      )
    } else {
      await SecureStore.deleteItemAsync(
        SECURE_STORAGE_KEYS.ALLOW_NON_SECURE_WEBSITES
      )
    }
  }, [])

  const handleRemindersToggle = useCallback(async (checked) => {
    setIsRemindersEnabled(checked)
    if (checked) {
      await SecureStore.deleteItemAsync(
        SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED
      )
    } else {
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED,
        'false'
      )
    }
  }, [])

  const handleClipboardTimeoutSelect = useCallback(
    async (value) => {
      setClipboardClearTimeout(value)
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.CLIPBOARD_CLEAR_TIMEOUT,
        value === null ? 'null' : String(value)
      )
      collapse()
    },
    [collapse]
  )

  const handleAutoLockSelect = useCallback(
    (value) => {
      setAutoLockTimeout(value)
      collapse()
    },
    [setAutoLockTimeout, collapse]
  )

  const handlePinToggle = useCallback(async () => {
    const newValue = !isPinEnabled
    setIsPinEnabled(newValue)
    if (newValue) {
      await SecureStore.setItemAsync(SECURE_STORAGE_KEYS.PIN_ENABLED, 'true')
    } else {
      await SecureStore.deleteItemAsync(SECURE_STORAGE_KEYS.PIN_ENABLED)
    }
  }, [isPinEnabled])

  const handleBiometricsToggle = useCallback(async () => {
    await toggleBiometrics(!isBiometricsEnabled)
  }, [isBiometricsEnabled, toggleBiometrics])

  const clipboardTimeoutLabel = useMemo(() => {
    const option = clipboardTimeoutOptions.find(
      (opt) => opt.value === clipboardClearTimeout
    )
    return option ? option.label : clipboardTimeoutOptions[0].label
  }, [clipboardClearTimeout, clipboardTimeoutOptions])

  const autoLockLabel = useMemo(() => {
    const option = autoLockOptions.find((opt) => opt.value === autoLockTimeout)
    return option ? option.label : ''
  }, [autoLockTimeout, autoLockOptions])

  const openClipboardPicker = useCallback(() => {
    expand({
      children: (
        <View>
          <SheetHeader
            showHandle
            title={t`Clear Clipboard`}
            onClose={collapse}
          />
          <View style={{ paddingBottom: bottom }}>
            {clipboardTimeoutOptions.map((option, index) => (
              <NavbarListItem
                key={String(option.value)}
                label={option.label}
                selected={option.value === clipboardClearTimeout}
                platform="mobile"
                showDivider={index < clipboardTimeoutOptions.length - 1}
                onClick={() => handleClipboardTimeoutSelect(option.value)}
              />
            ))}
          </View>
        </View>
      ),
      snapPoints: ['10%', '60%']
    })
  }, [
    t,
    collapse,
    expand,
    clipboardTimeoutOptions,
    clipboardClearTimeout,
    handleClipboardTimeoutSelect
  ])

  const openAutoLockPicker = useCallback(() => {
    expand({
      children: (
        <View>
          <SheetHeader showHandle title={t`Auto Lock`} onClose={collapse} />
          <View style={{ paddingBottom: bottom }}>
            {autoLockOptions.map((option, index) => (
              <NavbarListItem
                key={String(option.value)}
                label={option.label}
                selected={option.value === autoLockTimeout}
                platform="mobile"
                showDivider={index < autoLockOptions.length - 1}
                onClick={() => handleAutoLockSelect(option.value)}
              />
            ))}
          </View>
        </View>
      ),
      snapPoints: ['10%', '60%']
    })
  }, [
    t,
    collapse,
    expand,
    autoLockOptions,
    autoLockTimeout,
    handleAutoLockSelect
  ])

  const styles = getStyles(theme)

  return (
    <Layout
      scrollable
      header={
        <BackScreenHeader
          title={t`Settings`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={styles.content}
    >
      <PageHeader
        title={t`App Preferences`}
        subtitle={t`Control how PearPass works and keep your vault secure.`}
      />

      {/* Autofill & Browsing */}
      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Autofill & Browsing`}
        </Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <ToggleSwitch
              checked={isAutofillEnabled}
              onChange={handleAutofillToggle}
              label={t`Autofill`}
              description={t`Automatically fill usernames, passwords, and codes when you sign in`}
            />
          </View>
          <View style={styles.cardRow}>
            <View style={styles.dropdownColumn}>
              <View style={styles.rowTextContent}>
                <Text variant="labelEmphasized">{t`Clear Clipboard`}</Text>
                <Text variant="caption" color={theme.colors.colorTextSecondary}>
                  {t`Automatically remove copied credentials from your clipboard after a set time`}
                </Text>
              </View>
              <Pressable
                style={styles.dropdownFull}
                onPress={openClipboardPicker}
              >
                <Text variant="labelEmphasized">{clipboardTimeoutLabel}</Text>
                <ExpandMore
                  width={14}
                  height={14}
                  color={theme.colors.colorTextPrimary}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.cardRowLast}>
            <ToggleSwitch
              checked={isNonSecureAllowed}
              onChange={handleNonSecureToggle}
              label={t`Allow non-secure websites`}
              description={t`Allow autofill and access on HTTP websites. When disabled, only secure HTTPS sites are supported`}
            />
          </View>
        </View>
      </View>

      {/* Unlock Method */}
      <View style={styles.section}>
        <View style={styles.sectionLabelRow}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Unlock Method`}
          </Text>
          <InfoOutlined
            width={14}
            height={14}
            color={theme.colors.colorTextSecondary}
          />
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.checkboxRowInner}>
              <View
                style={[
                  styles.checkbox,
                  styles.checkboxChecked,
                  styles.checkboxDisabled
                ]}
              >
                <Check
                  width={12}
                  height={12}
                  color={theme.colors.colorSurfacePrimary}
                />
              </View>
              <View style={styles.rowTextContent}>
                <Text variant="labelEmphasized">{t`Master Password`}</Text>
                <Text variant="caption" color={theme.colors.colorTextSecondary}>
                  {t`Use your master password to unlock PearPass and decrypt your vault`}
                </Text>
              </View>
            </View>
          </View>

          {UNSUPPORTED && (
            <View style={styles.cardRow}>
              <View style={styles.checkboxRowInner}>
                <Pressable
                  style={[
                    styles.checkbox,
                    isPinEnabled && styles.checkboxChecked
                  ]}
                  onPress={handlePinToggle}
                >
                  {isPinEnabled && (
                    <Check
                      width={12}
                      height={12}
                      color={theme.colors.colorSurfacePrimary}
                    />
                  )}
                </Pressable>
                <View style={styles.rowTextContent}>
                  <Text variant="labelEmphasized">{t`Pin Code`}</Text>
                  <Text
                    variant="caption"
                    color={theme.colors.colorTextSecondary}
                  >
                    {t`Use a short PIN to quickly unlock PearPass on this device`}
                  </Text>
                </View>
                {isPinEnabled && (
                  <ContextMenu
                    trigger={
                      <Button
                        variant="tertiary"
                        size="small"
                        iconBefore={
                          <MoreVert color={theme.colors.colorTextPrimary} />
                        }
                      />
                    }
                  >
                    <View style={{ paddingBottom: bottom }}>
                      <NavbarListItem
                        platform="mobile"
                        icon={<Key color={theme.colors.colorTextPrimary} />}
                        label={t`Change PIN Code`}
                        showDivider
                      />
                      <NavbarListItem
                        platform="mobile"
                        variant="destructive"
                        icon={
                          <TrashOutlined
                            color={theme.colors.colorSurfaceDestructiveElevated}
                          />
                        }
                        label={t`Delete PIN Code`}
                      />
                    </View>
                  </ContextMenu>
                )}
              </View>
            </View>
          )}

          <View style={styles.cardRowLast}>
            <View style={styles.checkboxRowInner}>
              <Pressable
                style={[
                  styles.checkbox,
                  isBiometricsEnabled && styles.checkboxChecked
                ]}
                onPress={handleBiometricsToggle}
                disabled={!isBiometricsSupported}
              >
                {isBiometricsEnabled && (
                  <Check
                    width={12}
                    height={12}
                    color={theme.colors.colorSurfacePrimary}
                  />
                )}
              </Pressable>
              <View style={styles.rowTextContent}>
                <Text variant="labelEmphasized">{t`Biometrics`}</Text>
                <Text variant="caption" color={theme.colors.colorTextSecondary}>
                  {t`Use your device's built-in authentications (Face ID, fingerprint, or system PIN)`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Security Awareness */}
      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Security Awareness`}
        </Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.dropdownColumn}>
              <View style={styles.rowTextContent}>
                <Text variant="labelEmphasized">{t`Auto Lock`}</Text>
                <Text variant="caption" color={theme.colors.colorTextSecondary}>
                  {t`Automatically lock the app after selected period of inactivity`}
                </Text>
              </View>
              <Pressable
                style={styles.dropdownFull}
                onPress={openAutoLockPicker}
              >
                <Text variant="labelEmphasized">{autoLockLabel}</Text>
                <ExpandMore
                  width={14}
                  height={14}
                  color={theme.colors.colorTextPrimary}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.cardRowLast}>
            <ToggleSwitch
              checked={isRemindersEnabled}
              onChange={handleRemindersToggle}
              label={t`Reminders`}
              description={t`Get alerts when it's time to update your passwords`}
            />
          </View>
        </View>
      </View>
    </Layout>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    content: {
      gap: rawTokens.spacing20,
      flexGrow: 1,
      paddingBottom: rawTokens.spacing40
    },
    section: {
      gap: rawTokens.spacing12
    },
    sectionLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rawTokens.spacing4
    },
    card: {
      borderWidth: 1,
      borderColor: theme.colors.colorBorderPrimary,
      borderRadius: rawTokens.radius8,
      overflow: 'hidden'
    },
    cardRow: {
      paddingHorizontal: rawTokens.spacing12,
      paddingVertical: rawTokens.spacing16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.colorBorderPrimary
    },
    cardRowLast: {
      paddingHorizontal: rawTokens.spacing12,
      paddingVertical: rawTokens.spacing16
    },
    dropdownColumn: {
      gap: rawTokens.spacing12
    },
    rowTextContent: {
      flex: 1,
      gap: rawTokens.spacing4
    },
    dropdownFull: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: rawTokens.spacing12,
      paddingVertical: rawTokens.spacing12,
      borderWidth: 1,
      borderColor: theme.colors.colorBorderPrimary,
      borderRadius: rawTokens.radius8
    },
    checkboxRowInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rawTokens.spacing12
    },
    checkbox: {
      width: 16,
      height: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.colorBorderSecondary,
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkboxChecked: {
      backgroundColor: theme.colors.colorPrimary,
      borderColor: theme.colors.colorPrimary
    },
    checkboxDisabled: {
      opacity: 0.25
    }
  })
