import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  ContextMenu,
  ListItem,
  Text as UIKitText,
  Title,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  ContentCopy,
  ImportOutlined,
  SwapVert
} from '@tetherto/pearpass-lib-ui-kit/icons'
import {
  RECORD_TYPES,
  formatOtpCode,
  groupOtpRecords,
  isExpiring,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import { MOBILE_2FA_IMPORTS_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { isV2 } from 'src/utils/designVersion'

import { RecordItemIcon } from '../../components/RecordItemIcon'
import { TimerCircle } from '../../components/TimerCircle'
import { SORT_BY_TYPE } from '../../constants/sortOptions'
import { BottomSheetSortContentV2 } from '../../containers/BottomSheetSortContentV2'
import { EmptyResultsView } from '../../containers/EmptyResultsView'
import { Header } from '../../containers/Header'
import { Layout } from '../../containers/Layout'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { ItemCardIllustration } from '../../svgs/ItemCardIllustration'
import { getRecordSubtitle } from '../../utils/getRecordSubtitle'

type OtpPublic = {
  type: 'TOTP' | 'HOTP'
  digits: number
  period?: number
  currentCode: string | null
  timeRemaining?: number | null
}

type RecordWithOtp = {
  id: string
  type: string
  folder?: string
  data?: {
    title?: string
    username?: string
    websites?: string[]
  }
  otpPublic?: OtpPublic
}

type Section =
  | {
      type: 'totp-header'
      key: string
      period: number
      records: RecordWithOtp[]
    }
  | { type: 'hotp-header'; key: string }
  | { type: 'record'; key: string; record: RecordWithOtp }

export const Authenticator = () => {
  const { t } = useLingui()
  const navigation = useNavigation() as {
    navigate: (screen: string, params?: object) => void
  }
  const { theme } = useTheme()
  const { copyToClipboard } = useCopyToClipboard()
  const { state } = useSharedFilter() as {
    state: { sort: keyof typeof SORT_BY_TYPE }
  }
  const sort = useMemo(
    () =>
      SORT_BY_TYPE[state.sort] as {
        key: string
        direction: 'asc' | 'desc'
      },
    [state.sort]
  )

  const [searchValue, setSearchValue] = useState('')

  const { data: records } = useRecords({
    shouldSkip: true,
    variables: {
      filters: {
        hasOtp: true,
        searchPattern: searchValue
      },
      sort
    }
  }) as unknown as { data: RecordWithOtp[] | undefined }

  const otpRecords = useMemo(
    () => (records ?? []).filter((r) => r.otpPublic),
    [records]
  )

  const handleRecordPress = (record: RecordWithOtp) => {
    navigation.navigate('RecordDetails', {
      recordId: record.id,
      recordType: RECORD_TYPES.OTP,
      isOtpContext: true
    })
  }

  const sections = useMemo<Section[]>(() => {
    const { totpGroups, hotpRecords } = groupOtpRecords(otpRecords) as {
      totpGroups: { period: number; records: RecordWithOtp[] }[]
      hotpRecords: RecordWithOtp[]
    }

    const result: Section[] = []

    for (const group of totpGroups) {
      result.push({
        type: 'totp-header',
        key: `totp-header-${group.period}`,
        period: group.period,
        records: group.records
      })
      for (const record of group.records) {
        result.push({ type: 'record', key: record.id, record })
      }
    }

    if (hotpRecords.length > 0) {
      result.push({ type: 'hotp-header', key: 'hotp-header' })
      for (const record of hotpRecords) {
        result.push({ type: 'record', key: record.id, record })
      }
    }

    return result
  }, [otpRecords])

  const renderItem = ({ item, index }: { item: Section; index: number }) => {
    if (item.type === 'totp-header') {
      const firstRecord = item.records[0]
      const timeRemaining = firstRecord?.otpPublic?.timeRemaining ?? null
      const expiring = isExpiring(timeRemaining)

      return (
        <View>
          {index > 0 && (
            <View
              style={[
                styles.groupDivider,
                { backgroundColor: theme.colors.colorBorderPrimary }
              ]}
            />
          )}
          <View style={styles.groupHeader}>
            <TimerCircle timeRemaining={timeRemaining} period={item.period} />
            <Text
              style={[
                styles.groupLabelText,
                { color: theme.colors.colorTextPrimary }
              ]}
            >
              {t`Codes expiring in`}{' '}
            </Text>
            <Text
              style={[
                styles.groupTimeValue,
                {
                  color: expiring
                    ? theme.colors.colorTextDestructive
                    : theme.colors.colorPrimary
                }
              ]}
            >
              {timeRemaining !== null ? `${timeRemaining}s` : `${item.period}s`}
            </Text>
          </View>
        </View>
      )
    }

    if (item.type === 'hotp-header') {
      return (
        <View>
          {index > 0 && (
            <View
              style={[
                styles.groupDivider,
                { backgroundColor: theme.colors.colorBorderPrimary }
              ]}
            />
          )}
          <View style={styles.groupHeader}>
            <Text
              style={[
                styles.groupLabelText,
                { color: theme.colors.colorTextPrimary }
              ]}
            >
              {t`Counter-based`}
            </Text>
          </View>
        </View>
      )
    }

    const { record } = item
    const code = record.otpPublic?.currentCode ?? null

    return (
      <View style={styles.recordItem}>
        <ListItem
          icon={<RecordItemIcon record={record} />}
          iconSize={32}
          title={record.data?.title ?? ''}
          titleStyle={styles.itemTitle as object}
          subtitle={getRecordSubtitle(record) || undefined}
          subtitleStyle={styles.itemSubtitle as object}
          onClick={() => handleRecordPress(record)}
          testID={`authenticator-record-${record.id}`}
          rightElement={
            <View style={styles.recordRightSlot}>
              <UIKitText variant="labelEmphasized" numberOfLines={1}>
                {formatOtpCode(code)}
              </UIKitText>
              <Pressable
                onPress={() => code && copyToClipboard(code)}
                accessibilityLabel={t`Copy code`}
                hitSlop={8}
                testID={`authenticator-copy-code-${record.id}`}
              >
                <ContentCopy
                  width={16}
                  height={16}
                  color={theme.colors.colorTextPrimary}
                />
              </Pressable>
            </View>
          }
        />
      </View>
    )
  }

  const headerEl = (
    <Header
      setSearchValue={setSearchValue}
      searchValue={searchValue}
      itemsFound={otpRecords.length}
      setIsMultiSelectOn={() => {}}
      isMultiSelectOn={false}
      setSelectedRecords={() => {}}
      selectedRecords={[]}
    />
  )

  const body = (
    <>
      {isV2() && (
        <View
          style={[
            styles.screenTitleBar,
            { borderColor: theme.colors.colorBorderPrimary }
          ]}
        >
          <View style={styles.screenTitleTextWrapper}>
            <UIKitText variant="labelEmphasized" numberOfLines={1}>
              {t`Authenticator`}
            </UIKitText>
          </View>
          <View
            style={[
              styles.screenTitleSortSection,
              { borderLeftColor: theme.colors.colorBorderPrimary }
            ]}
          >
            <ContextMenu
              trigger={
                <Button
                  variant="tertiary"
                  iconBefore={
                    <SwapVert color={theme.colors.colorTextPrimary} />
                  }
                  aria-label={t`Sort items`}
                  data-testid="authenticator-sort-button"
                />
              }
            >
              <BottomSheetSortContentV2 />
            </ContextMenu>
          </View>
        </View>
      )}

      {otpRecords.length === 0 && !searchValue.length && (
        <ScrollView
          style={styles.emptyScroll}
          contentContainerStyle={styles.emptyStateContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ItemCardIllustration />
          <View style={styles.emptyTitle}>
            <Title
              style={styles.textCenter as object}
            >{t`No codes saved`}</Title>
          </View>
          <View style={styles.emptyDescription}>
            <UIKitText
              variant="label"
              color={theme.colors.colorTextSecondary}
              style={styles.textCenter as object}
            >
              {t`Save your first authenticator code or import your codes from another authenticator app.`}
            </UIKitText>
          </View>
          <View style={styles.emptyButtonsContainer}>
            <Button
              variant="primary"
              fullWidth
              iconBefore={<Add />}
              onClick={() =>
                navigation.navigate('CreateRecord', {
                  recordType: RECORD_TYPES.OTP
                })
              }
              data-testid="authenticator-add-code-button"
            >
              {t`Add Code`}
            </Button>
            {MOBILE_2FA_IMPORTS_ENABLED && (
              <Button
                variant="secondary"
                fullWidth
                iconBefore={
                  <ImportOutlined color={theme.colors.colorTextPrimary} />
                }
                onClick={() => navigation.navigate('ImportItems')}
                data-testid="authenticator-import-codes-button"
              >
                {t`Import Codes`}
              </Button>
            )}
          </View>
        </ScrollView>
      )}

      {otpRecords.length === 0 && !!searchValue.length && <EmptyResultsView />}

      {otpRecords.length > 0 && (
        <FlatList
          style={styles.listSection}
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      )}
    </>
  )

  if (isV2()) {
    return (
      <Layout header={headerEl} contentStyle={{ padding: 0 }} isBuiltin={false}>
        {body}
      </Layout>
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.colorSurfacePrimary }
      ]}
    >
      {headerEl}
      {body}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing16
  },
  screenTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1
  },
  screenTitleTextWrapper: {
    flex: 1,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing12
  },
  screenTitleSortSection: {
    borderLeftWidth: 1,
    padding: rawTokens.spacing8,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  emptyScroll: {
    flex: 1
  },
  emptyStateContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing40
  },
  emptyTitle: {
    marginTop: rawTokens.spacing24,
    marginBottom: rawTokens.spacing12
  },
  emptyDescription: {
    marginBottom: rawTokens.spacing24
  },
  textCenter: {
    textAlign: 'center'
  },
  emptyButtonsContainer: {
    width: '100%',
    gap: rawTokens.spacing8
  },
  listSection: {
    flex: 1,
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing12
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    paddingVertical: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing4
  },
  groupLabelText: {
    fontSize: rawTokens.fontSize14,
    fontWeight: '500'
  },
  groupTimeValue: {
    fontSize: rawTokens.fontSize14,
    fontWeight: '600'
  },
  groupDivider: {
    height: 1,
    marginTop: rawTokens.spacing8,
    marginBottom: rawTokens.spacing12,
    marginHorizontal: rawTokens.spacing4
  },
  recordItem: {
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  },
  recordRightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4
  },
  itemTitle: {
    fontWeight: '500'
  },
  itemSubtitle: {
    fontSize: rawTokens.fontSize14,
    fontWeight: '400'
  }
})
