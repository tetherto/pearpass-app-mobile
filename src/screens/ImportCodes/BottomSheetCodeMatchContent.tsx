import { t } from '@lingui/core/macro'
import {
  InputField,
  ListItem,
  rawTokens,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Link, LinkOff } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useState } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RecordItemIcon } from 'src/components/RecordItemIcon'
import { SheetHeader } from 'src/containers/BottomSheet/SheetHeader'
import { Layout } from 'src/containers/Layout'
import type { MatchRecord } from './types'

const recordForIcon = (title: string) => ({
  type: 'login',
  data: { title }
})

type Props = {
  records: MatchRecord[]
  currentMatchId?: string | null
  onSelect: (record: MatchRecord) => void
  onClose: () => void
}

export const BottomSheetCodeMatchContent = ({
  records,
  currentMatchId,
  onSelect,
  onClose
}: Props) => {
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()
  const { height: screenHeight } = useWindowDimensions()
  const [search, setSearch] = useState('')

  const filtered = records.filter((r) =>
    r.title.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <Layout
      mode="sheet"
      contentStyle={{ padding: 0 }}
      header={
        <SheetHeader title={t`Change Login Match`} onClose={onClose} />
      }
    >
      <View style={styles.searchWrapper}>
        <InputField
          label=""
          value={search}
          onChangeText={setSearch}
          placeholder={t`Search...`}
          testID="import-codes-match-search"
        />
      </View>

      <View
        style={{
          height: screenHeight * 0.7
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: bottom }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="caption" color={theme.colors.colorTextSecondary}>
                {t`No login records found`}
              </Text>
            </View>
          ) : (
            filtered.map((record, idx) => {
              const isCurrent = currentMatchId === record.id
              return (
                <ListItem
                  platform="mobile"
                  icon={<RecordItemIcon record={recordForIcon(record.title)} />}
                  iconSize={32}
                  title={record.title}
                  subtitle={record.subtitle}
                  showDivider={idx < filtered.length - 1}
                  style={
                    [
                      styles.listItem,
                      isCurrent && {
                        backgroundColor: theme.colors.colorSurfaceHover
                      }
                    ] as object
                  }
                  rightElement={
                    isCurrent ? (
                      <LinkOff
                        width={16}
                        height={16}
                        color={theme.colors.colorTextSecondary}
                      />
                    ) : (
                      <Link
                        width={16}
                        height={16}
                        color={theme.colors.colorTextSecondary}
                      />
                    )
                  }
                  onClick={() => onSelect(record)}
                  testID={`import-codes-match-record-${record.id}`}
                  key={record.id}
                />
              )
            })
          )}
        </ScrollView>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing12
  },
  listItem: {
    paddingVertical: rawTokens.spacing20,
    paddingHorizontal: rawTokens.spacing16,
    gap: rawTokens.spacing12
  },
  empty: {
    paddingVertical: rawTokens.spacing24,
    alignItems: 'center'
  }
})
