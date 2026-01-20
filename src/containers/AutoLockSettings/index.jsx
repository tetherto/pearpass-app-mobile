import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  AUTO_LOCK_TIMEOUT_OPTIONS,
  DEFAULT_AUTO_LOCK_TIMEOUT
} from 'pearpass-lib-constants'
import { ArrowDownIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { BottomSheetAutoLockContent } from './BottomSheetContent'
import { AppSwitch } from '../../components/AppSwitch/AppSwitch'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'

/**
 * @returns {JSX.Element}
 */
export const AutoLockSettings = () => {
  const { t } = useLingui()
  const { expand, collapse } = useBottomSheet()
  const { autoLockTimeout, setAutoLockTimeout, isAutoLockEnabled } =
    useAutoLockContext()

  const currentTimeoutLabel = useMemo(() => {
    const option = Object.values(AUTO_LOCK_TIMEOUT_OPTIONS).find(
      (opt) => opt.value === autoLockTimeout
    )
    return option ? t(option.label) : ''
  }, [autoLockTimeout, t])

  const handleToggleAutoLock = (enabled) => {
    setAutoLockTimeout(enabled ? DEFAULT_AUTO_LOCK_TIMEOUT : null)
  }

  const handleTimeoutSelect = (value) => {
    setAutoLockTimeout(value)
    collapse()
  }

  const handleOpenSelector = () => {
    expand({
      children: (
        <BottomSheetAutoLockContent
          selectedValue={autoLockTimeout}
          onSelect={handleTimeoutSelect}
        />
      ),
      snapPoints: ['10%', '40%']
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{t`Auto Log-out`}</Text>
        <AppSwitch
          value={isAutoLockEnabled}
          onChange={handleToggleAutoLock}
          testIDOn="auto-logout-toggle-on"
          testIDOff="auto-logout-toggle-off"
          accessibilityLabelOn={t`Auto Log-out enabled`}
          accessibilityLabelOff={t`Auto Log-out disabled`}
        />
      </View>
      <Text style={styles.description}>
        {t`Automatically logs you out after you stop interacting with the app, based on the timeout you select.`}
      </Text>
      {isAutoLockEnabled && (
        <Pressable style={styles.timeoutSelector} onPress={handleOpenSelector}>
          <Text style={styles.timeoutText}>{currentTimeoutLabel}</Text>
          <ArrowDownIcon size="14" />
        </Pressable>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    display: 'flex'
  },
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '300',
    marginTop: 5
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  settingLabel: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700'
  },
  timeoutSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.grey400.mode1,
    borderRadius: 8,
    marginTop: 8
  },
  timeoutText: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700'
  }
})
