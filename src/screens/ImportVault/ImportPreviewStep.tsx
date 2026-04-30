import { useLingui } from '@lingui/react/macro'
import { useRecords, useVault } from '@tetherto/pearpass-lib-vault'
import { rawTokens, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

import { VaultPreviewCard } from './VaultPreviewCard'

type ImportPreviewStepProps = {
  error: string
}

export const ImportPreviewStep = ({ error }: ImportPreviewStepProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  const { data: vaultData } = useVault()
  const { data: records } = useRecords({
    shouldSkip: false,
    variables: {
      filters: {
        searchPattern: ''
      },
      sort: { key: 'updatedAt', direction: 'desc' }
    }
  })

  const recordList = Array.isArray(records) ? records : []

  return (
    <View style={styles.content}>
      <Text variant="caption" color={theme.colors.colorTextSecondary}>
        {t`Vault Imported`}
      </Text>

      <VaultPreviewCard
        vaultName={vaultData?.name || t`Shared Vault`}
        records={recordList}
      />

      {error ? (
        <Text
          variant="caption"
          color={theme.colors.colorSurfaceDestructiveElevated}
          data-testid="import-vault-preview-error"
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: rawTokens.spacing16
  }
})
