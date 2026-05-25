import { t } from '@lingui/core/macro'
import {
  AlertMessage,
  Button,
  ContextMenu,
  rawTokens,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Close,
  ExpandMore,
  Link,
  LinkOff
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { RecordItemIcon } from 'src/components/RecordItemIcon'
import { BottomSheetCodeMatchContent } from './BottomSheetCodeMatchContent'
import type { CodeMatchEntry, ImportedCode, MatchRecord } from './types'

const MOCK_IMPORTED_CODES: ImportedCode[] = [
  { id: '1', issuer: 'Microsoft 365', accountName: 'simon.j@gmail.com' },
  { id: '2', issuer: 'Slack', accountName: 'acme.1994@gmail.com' },
  { id: '3', issuer: 'GitHub', accountName: 'kristian.k04@zoho.com' },
  { id: '4', issuer: 'Adobe', accountName: 'taylor@gmail.com' },
  { id: '5', issuer: 'Amazon', accountName: 'esme.ee14@outlook.com' },
  { id: '6', issuer: 'Booking.com', accountName: 'simon.j@gmail.com' },
  { id: '7', issuer: 'Kickstarter', accountName: 'simonjtrack@yahoo.com' }
]

const MOCK_LOGIN_RECORDS: MatchRecord[] = [
  { id: 'r1', title: 'Microsoft 365', subtitle: 'simon.j@gmail.com' },
  { id: 'r2', title: 'Slack', subtitle: 'acme.1994@gmail.com' },
  { id: 'r3', title: 'GitHub', subtitle: 'kristian.k04@zoho.com' },
  { id: 'r4', title: 'Adobe', subtitle: 'taylor@gmail.com' }
]

const INITIAL_MATCHES = new Map<string, string>([
  ['1', 'r1'],
  ['2', 'r2'],
  ['3', 'r3'],
  ['4', 'r4']
])

const recordForIcon = (title: string) => ({
  type: 'login',
  data: { title }
})

const ACTION_COL_WIDTH = 56

export const ScanResultsView = () => {
  const { theme } = useTheme()

  const [codeMatches, setCodeMatches] = useState<CodeMatchEntry[]>(() =>
    MOCK_IMPORTED_CODES.map((code) => {
      const matchedId = INITIAL_MATCHES.get(code.id)
      const matched = matchedId
        ? (MOCK_LOGIN_RECORDS.find((r) => r.id === matchedId) ?? null)
        : null
      return { code, matchedRecord: matched }
    })
  )
  const [activeCodeId, setActiveCodeId] = useState<string | null>(null)

  const handleLinkRecord = (codeId: string, record: MatchRecord) => {
    setCodeMatches((prev) =>
      prev.map((entry) =>
        entry.code.id === codeId ? { ...entry, matchedRecord: record } : entry
      )
    )
    setActiveCodeId(null)
  }

  const handleUnlinkRecord = (codeId: string) => {
    setCodeMatches((prev) =>
      prev.map((entry) =>
        entry.code.id === codeId ? { ...entry, matchedRecord: null } : entry
      )
    )
  }

  const dividerColor = theme.colors.colorSurfaceDisabled
  const activeEntry =
    activeCodeId !== null
      ? (codeMatches.find((e) => e.code.id === activeCodeId) ?? null)
      : null

  return (
    <View style={styles.container}>
      <AlertMessage
        variant="info"
        size="small"
        title={t`Your authenticator codes are ready`}
        description={t`We matched them with existing logins to keep related info together and save you time. Nothing is final — review, unlink, or change any match below.`}
        testID="import-codes-scan-results-alert"
      />

      <View>
        <View style={styles.sectionCaption}>
          <Text variant="caption" color={theme.colors.colorTextSecondary}>
            {t`Codes Ready to Review`}
          </Text>
        </View>

        <View style={[styles.table, { borderColor: dividerColor }]}>
          <View
            style={[
              styles.headerRow,
              { borderBottomColor: dividerColor }
            ]}
          >
            <View style={styles.headerCell}>
              <Text variant="caption" color={theme.colors.colorTextSecondary}>
                {t`Imported Code`}
              </Text>
            </View>
            <View
              style={[styles.verticalDivider, { backgroundColor: dividerColor }]}
            />
            <View style={styles.headerCell}>
              <Text variant="caption" color={theme.colors.colorTextSecondary}>
                {t`Login Match Found`}
              </Text>
            </View>
            <View
              style={[styles.verticalDivider, { backgroundColor: dividerColor }]}
            />
            <View style={styles.actionCol} />
          </View>

          {codeMatches.map((entry, index) => {
            const isLast = index === codeMatches.length - 1
            const matched = entry.matchedRecord
            const rowBorder = !isLast && {
              borderBottomColor: dividerColor,
              borderBottomWidth: 1
            }

            return (
              <View key={entry.code.id} style={[styles.row, rowBorder]}>
                <View style={styles.cell}>
                  <RecordItemIcon
                    record={recordForIcon(entry.code.issuer)}
                  />
                  <Text
                    variant="labelEmphasized"
                    color={theme.colors.colorTextPrimary}
                    numberOfLines={1}
                  >
                    {entry.code.issuer}
                  </Text>
                  <Text
                    variant="caption"
                    color={theme.colors.colorTextSecondary}
                    numberOfLines={1}
                  >
                    {entry.code.accountName}
                  </Text>
                </View>

                <View
                  style={[
                    styles.verticalDivider,
                    { backgroundColor: dividerColor }
                  ]}
                />

                <Pressable
                  style={styles.cell}
                  onPress={() => setActiveCodeId(entry.code.id)}
                  testID={`import-codes-row-${entry.code.id}`}
                >
                  {matched ? (
                    <RecordItemIcon record={recordForIcon(matched.title)} />
                  ) : (
                    <View
                      style={[
                        styles.noMatchIcon,
                        { backgroundColor: dividerColor }
                      ]}
                    >
                      <Close
                        width={16}
                        height={16}
                        color={theme.colors.colorPrimary}
                      />
                    </View>
                  )}
                  <View style={styles.matchTitleRow}>
                    <Text
                      variant="labelEmphasized"
                      color={theme.colors.colorTextPrimary}
                      numberOfLines={1}
                    >
                      {matched ? matched.title : t`No Match`}
                    </Text>
                    <ExpandMore
                      width={14}
                      height={14}
                      color={theme.colors.colorTextPrimary}
                    />
                  </View>
                  <Text
                    variant="caption"
                    color={theme.colors.colorTextSecondary}
                    numberOfLines={1}
                  >
                    {matched
                      ? (matched.subtitle ?? '')
                      : t`Match or leave it blank`}
                  </Text>
                </Pressable>

                <View
                  style={[
                    styles.verticalDivider,
                    { backgroundColor: dividerColor }
                  ]}
                />

                <View style={styles.actionCol}>
                  {matched ? (
                    <Button
                      variant="secondary"
                      size="medium"
                      aria-label={t`Unlink Match`}
                      iconBefore={
                        <LinkOff
                          width={16}
                          height={16}
                          color={theme.colors.colorTextPrimary}
                        />
                      }
                      onClick={() => handleUnlinkRecord(entry.code.id)}
                      data-testid={`import-codes-unlink-${entry.code.id}`}
                    />
                  ) : (
                    <Button
                      variant="secondary"
                      size="medium"
                      aria-label={t`Link Manually`}
                      iconBefore={
                        <Link
                          width={16}
                          height={16}
                          color={theme.colors.colorTextPrimary}
                        />
                      }
                      onClick={() => setActiveCodeId(entry.code.id)}
                      data-testid={`import-codes-link-${entry.code.id}`}
                    />
                  )}
                </View>
              </View>
            )
          })}
        </View>
      </View>

      <ContextMenu
        open={activeCodeId !== null}
        onOpenChange={(open) => {
          if (!open) setActiveCodeId(null)
        }}
      >
        {activeEntry && (
          <BottomSheetCodeMatchContent
            records={MOCK_LOGIN_RECORDS}
            currentMatchId={activeEntry.matchedRecord?.id ?? null}
            onSelect={(record) =>
              handleLinkRecord(activeEntry.code.id, record)
            }
            onClose={() => setActiveCodeId(null)}
          />
        )}
      </ContextMenu>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: rawTokens.spacing16
  },
  sectionCaption: {
    marginBottom: rawTokens.spacing8
  },
  table: {
    borderRadius: rawTokens.spacing8,
    borderWidth: 1,
    overflow: 'hidden'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1
  },
  headerCell: {
    flex: 1,
    minWidth: 0,
    paddingVertical: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  cell: {
    flex: 1,
    minWidth: 0,
    paddingVertical: rawTokens.spacing12,
    paddingHorizontal: rawTokens.spacing12,
    gap: rawTokens.spacing6
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch'
  },
  matchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4
  },
  noMatchIcon: {
    width: 32,
    height: 32,
    borderRadius: rawTokens.radius8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionCol: {
    width: ACTION_COL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rawTokens.spacing4
  }
})
