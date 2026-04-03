import { useLingui } from '@lingui/react/macro'
import { rawTokens, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

import { VaultPreviewCard } from './VaultPreviewCard'

type VaultRecord = {
  id: string
  type: string
  data?: {
    title?: string
    username?: string
  }
}

type Vault = {
  name?: string
  customFolders?: Record<string, { records?: VaultRecord[] }>
  favorites?: { records?: VaultRecord[] }
} | null

type ImportPreviewStepProps = {
  vault: Vault
  error: string
}

export const ImportPreviewStep = ({ vault, error }: ImportPreviewStepProps) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  const records = getAllRecords(vault)

  return (
    <View style={styles.content}>
      <Text variant="caption" color={theme.colors.colorTextSecondary}>
        {t`Vault Imported`}
      </Text>

      <VaultPreviewCard
        vaultName={vault?.name || t`Shared Vault`}
        records={records}
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

function getAllRecords(vault: Vault): VaultRecord[] {
  if (!vault) return []

  const records: VaultRecord[] = []

  if (vault.customFolders) {
    for (const folder of Object.values(vault.customFolders)) {
      if (folder?.records) {
        records.push(...folder.records)
      }
    }
  }

  if (vault.favorites?.records) {
    const existingIds = new Set(records.map((r) => r.id))
    for (const record of vault.favorites.records) {
      if (!existingIds.has(record.id)) {
        records.push(record)
      }
    }
  }

  return records
}

const styles = StyleSheet.create({
  content: {
    gap: rawTokens.spacing16
  }
})
