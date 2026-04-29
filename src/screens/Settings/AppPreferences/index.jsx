import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  CLIPBOARD_CLEAR_TIMEOUT,
  UNSUPPORTED
} from '@tetherto/pearpass-lib-constants'
import {
  Button,
  Checkbox,
  ContextMenu,
  NavbarListItem,
  PageHeader,
  Text,
  ToggleSwitch,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  ExpandMore,
  InfoOutlined,
  Key,
  MoreVert,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import * as SecureStore from 'expo-secure-store'
import { AppState, Platform, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { IOS_APP_GROUP_ID } from '../../../constants/iosAppGroup'
import { SECURE_STORAGE_KEYS } from '../../../constants/secureStorageKeys'
import { OptionsSheet } from '../../../containers/BottomSheet/OptionsSheet'
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
import { storeOptionalFlag } from '../../../utils/secureStoreFlag'
import { showInfoAlertToast } from '../../../utils/showInfoAlertToast'

const SHEET_SNAP_POINTS = ['10%', '60%']

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
    CLIPBOARD_CLEAR_TIMEOUT
  )
  const [isNonSecureAllowed, setIsNonSecureAllowed] = useState(false)
  const [isPinEnabled, setIsPinEnabled] = useState(false)
  const [isRemindersEnabled, setIsRemindersEnabled] = useState(true)
  const [isCopyToClipboardEnabled, setIsCopyToClipboardEnabled] = useState(true)
  const appStateRef = useRef(AppState.currentState)

  const clipboardTimeoutOptions = useMemo(
    () => [
      { label: t`30 Seconds`, value: 30000 },
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

  const refreshAutofillStatus = useCallback(async () => {
    const enabled = await checkAutofillEnabled()
    setIsAutofillEnabled(enabled)
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      const [clipTimeout, nonSecure, pin, copyToClipboard] = await Promise.all([
        SecureStore.getItemAsync(SECURE_STORAGE_KEYS.CLIPBOARD_CLEAR_TIMEOUT),
        SecureStore.getItemAsync(SECURE_STORAGE_KEYS.ALLOW_NON_SECURE_WEBSITES),
        SecureStore.getItemAsync(SECURE_STORAGE_KEYS.PIN_ENABLED),
        SecureStore.getItemAsync(SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD, {
          accessGroup: IOS_APP_GROUP_ID
        })
      ])

      if (clipTimeout === 'null') {
        setClipboardClearTimeout(null)
      } else if (clipTimeout !== null) {
        setClipboardClearTimeout(Number(clipTimeout))
      }
      setIsNonSecureAllowed(nonSecure === 'true')
      setIsPinEnabled(pin === 'true')
      setIsRemindersEnabled(isPasswordChangeReminderEnabled)
      setIsCopyToClipboardEnabled(copyToClipboard !== 'false')
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
      return
    }

    const isIOS18OrNewer =
      Platform.OS === 'ios' &&
      Number(String(Platform.Version).split('.')[0]) >= 18

    if (!isIOS18OrNewer) {
      await openAutofillSettings()
      return
    }

    const enabled = await requestToEnableAutofill()
    if (!enabled) {
      showInfoAlertToast({
        theme,
        description: t`Autofill couldn't be enabled`,
        actionText: t`Open Settings`,
        onAction: () => openAutofillSettings()
      })
    }
  }, [isAutofillEnabled, t, theme])

  const handleNonSecureToggle = useCallback(async (checked) => {
    setIsNonSecureAllowed(checked)
    await storeOptionalFlag(
      SECURE_STORAGE_KEYS.ALLOW_NON_SECURE_WEBSITES,
      checked,
      false
    )
  }, [])

  const handleRemindersToggle = useCallback(async (checked) => {
    setIsRemindersEnabled(checked)
    await storeOptionalFlag(
      SECURE_STORAGE_KEYS.IS_PASSWORD_CHANGE_REMINDER_ENABLED,
      checked,
      true
    )
  }, [])

  const handleCopyToClipboardToggle = useCallback(async (checked) => {
    setIsCopyToClipboardEnabled(checked)
    if (checked) {
      await SecureStore.deleteItemAsync(SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD)
    } else {
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.COPY_TO_CLIPBOARD,
        'false',
        { accessGroup: IOS_APP_GROUP_ID }
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
    await storeOptionalFlag(SECURE_STORAGE_KEYS.PIN_ENABLED, newValue, false)
  }, [isPinEnabled])

  const handleBiometricsToggle = useCallback(async () => {
    await toggleBiometrics(!isBiometricsEnabled)
  }, [isBiometricsEnabled, toggleBiometrics])

  const clipboardTimeoutLabel = useMemo(() => {
    const option = clipboardTimeoutOptions.find(
      (opt) => opt.value === clipboardClearTimeout
    )
    return option ? option.label : ''
  }, [clipboardClearTimeout, clipboardTimeoutOptions])

  const autoLockLabel = useMemo(() => {
    const option = autoLockOptions.find((opt) => opt.value === autoLockTimeout)
    return option ? option.label : ''
  }, [autoLockTimeout, autoLockOptions])

  const openClipboardPicker = useCallback(() => {
    expand({
      children: (
        <OptionsSheet
          title={t`Clear Clipboard`}
          options={clipboardTimeoutOptions}
          selectedValue={clipboardClearTimeout}
          onSelect={handleClipboardTimeoutSelect}
          onClose={collapse}
        />
      ),
      snapPoints: SHEET_SNAP_POINTS
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
        <OptionsSheet
          title={t`Auto Lock`}
          options={autoLockOptions}
          selectedValue={autoLockTimeout}
          onSelect={handleAutoLockSelect}
          onClose={collapse}
        />
      ),
      snapPoints: SHEET_SNAP_POINTS
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

  const cardRowStyle = (isLast) =>
    isLast ? styles.cardRow : [styles.cardRow, styles.cardRowDivider]

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
          <View style={cardRowStyle(false)}>
            <ToggleSwitch
              checked={isAutofillEnabled}
              onChange={handleAutofillToggle}
              label={t`Autofill`}
              description={t`Automatically fill usernames, passwords, and codes when you sign in`}
            />
          </View>
          <View style={cardRowStyle(!UNSUPPORTED)}>
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
          {UNSUPPORTED && (
            <View style={cardRowStyle(true)}>
              <ToggleSwitch
                checked={isNonSecureAllowed}
                onChange={handleNonSecureToggle}
                label={t`Allow non-secure websites`}
                description={t`Allow autofill and access on HTTP websites. When disabled, only secure HTTPS sites are supported`}
              />
            </View>
          )}
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
          <View style={cardRowStyle(false)}>
            <Checkbox
              checked
              disabled
              label={t`Master Password`}
              description={t`Use your master password to unlock PearPass and decrypt your vault`}
            />
          </View>

          {UNSUPPORTED && (
            <View style={cardRowStyle(false)}>
              <View style={styles.checkboxRowInner}>
                <Checkbox
                  checked={isPinEnabled}
                  onChange={handlePinToggle}
                  label={t`Pin Code`}
                  description={t`Use a short PIN to quickly unlock PearPass on this device`}
                />
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

          <View style={cardRowStyle(true)}>
            <Checkbox
              checked={isBiometricsEnabled}
              onChange={handleBiometricsToggle}
              disabled={!isBiometricsSupported}
              label={t`Biometrics`}
              description={t`Use your device's built-in authentications (Face ID, fingerprint, or system PIN)`}
            />
          </View>
        </View>
      </View>

      {/* Security Awareness */}
      <View style={styles.section}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Security Awareness`}
        </Text>
        <View style={styles.card}>
          <View style={cardRowStyle(false)}>
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
          <View style={cardRowStyle(false)}>
            <ToggleSwitch
              checked={isCopyToClipboardEnabled}
              onChange={handleCopyToClipboardToggle}
              label={t`Copy to Clipboard`}
              description={t`Enable one-tap copying to move your credentials between apps effortlessly.`}
            />
          </View>
          <View style={cardRowStyle(true)}>
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
      paddingVertical: rawTokens.spacing16
    },
    cardRowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.colorBorderPrimary
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
    }
  })
