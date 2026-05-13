import { useCallback, useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  PageHeader,
  Text,
  ToggleSwitch,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Platform, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { version } from '../../../../package.json'
import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { useLogLevel } from '../../../utils/logConfigurationStorage'
import { getLogFileStats, shareAllLogs } from '../../../utils/logger'

const formatBytes = (n) => {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export const Diagnostics = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [logLevel, setLogLevel] = useLogLevel()
  const [stats, setStats] = useState(() => getLogFileStats())
  const [isSharing, setIsSharing] = useState(false)

  const refreshStats = useCallback(() => {
    setStats(getLogFileStats())
  }, [])

  useEffect(() => {
    if (logLevel === 'off') return
    const id = setInterval(refreshStats, 2000)
    return () => clearInterval(id)
  }, [logLevel, refreshStats])

  const onToggle = async (enabled) => {
    await setLogLevel(enabled ? 'debug' : 'off')
    refreshStats()
  }

  const onShare = async () => {
    setIsSharing(true)
    try {
      const result = await shareAllLogs({
        appVersion: version,
        platform: Platform.OS,
        platformVersion: String(Platform.Version ?? ''),
        deviceModel: Platform.constants?.Brand ?? 'unknown',
        logLevel
      })
      if (!result.shared) {
        Toast.show({
          type: 'baseToast',
          text1:
            result.reason === 'no-logs'
              ? t`No logs captured yet — reproduce the issue first.`
              : t`Sharing isn't available on this device.`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    } finally {
      setIsSharing(false)
    }
  }

  const isOff = logLevel === 'off'
  const hasLogs = stats.totalBytes > 0
  const shareDisabled = !hasLogs || isSharing

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
        title={t`Diagnostics`}
        subtitle={t`Logs help us troubleshoot issues. Enable logging, reproduce the problem, then share the logs with us.`}
      />

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.colorSurfacePrimary,
            borderColor: theme.colors.colorBorderPrimary
          }
        ]}
      >
        <ToggleSwitch
          checked={!isOff}
          onChange={onToggle}
          label={t`Enable logs`}
          description={t`Capture verbose logs to share with us.`}
          testID="diagnostics-log-toggle"
        />
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.colorSurfacePrimary,
            borderColor: theme.colors.colorBorderPrimary
          }
        ]}
      >
        <Text variant="labelEmphasized">{t`Captured logs`}</Text>
        <View style={styles.statRow}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Core (worklet):`}
          </Text>
          <Text variant="caption" testID="diagnostics-stats-core">
            {formatBytes(stats.core)}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Main (app):`}
          </Text>
          <Text variant="caption" testID="diagnostics-stats-main">
            {formatBytes(stats.main)}
          </Text>
        </View>
      </View>

      <Button
        variant="primary"
        fullWidth
        disabled={shareDisabled}
        isLoading={isSharing}
        onClick={onShare}
        testID="diagnostics-share-all"
      >
        {t`Share logs (.zip)`}
      </Button>
      {isOff && !hasLogs ? (
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`Enable diagnostic logs to start capturing.`}
        </Text>
      ) : !isOff && !hasLogs ? (
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {t`No logs captured yet. Reproduce the issue, then return here.`}
        </Text>
      ) : null}
    </Layout>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: rawTokens.spacing16,
    paddingTop: rawTokens.spacing24,
    gap: rawTokens.spacing16,
    flexGrow: 1
  },
  card: {
    borderWidth: 1,
    borderRadius: rawTokens.radius8,
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing8
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
