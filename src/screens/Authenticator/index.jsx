import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { LockIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import {
  formatOtpCode,
  isExpiring,
  OTP_TYPE,
  useOtpCodes,
  useRecords
} from 'pearpass-lib-vault'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { styles } from './styles'
import { AvatarRecord } from '../../components/AvatarRecord'
import { getTimerColor } from '../../components/OtpCodeField/utils'
import { TimerCircle } from '../../components/TimerCircle'
import { Header } from '../../containers/Header'
import { CopyButton } from '../../libComponents/CopyButton'

export const Authenticator = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const [searchValue, setSearchValue] = useState('')

  const { data: records } = useRecords({
    shouldSkip: true,
    variables: {
      filters: {
        hasOtp: true,
        searchPattern: searchValue
      },
      sort: { key: 'updatedAt', direction: 'desc' }
    }
  })

  const otpRecords = useMemo(
    () => (records || []).filter((r) => r.otpPublic),
    [records]
  )

  const { otpCodes } = useOtpCodes(otpRecords)

  const handleRecordPress = (record) => {
    navigation.navigate('RecordDetails', { recordId: record.id })
  }

  // Separate TOTP and HOTP records, group TOTP by period
  const sections = useMemo(() => {
    const groupMap = {}
    const hotp = []

    for (const record of otpRecords) {
      if (record.otpPublic?.type === OTP_TYPE.HOTP) {
        hotp.push(record)
      } else {
        const period = record.otpPublic?.period ?? 30
        if (!groupMap[period]) {
          groupMap[period] = []
        }
        groupMap[period].push(record)
      }
    }

    const result = []

    const groups = Object.entries(groupMap)
      .map(([period, groupRecords]) => ({
        period: Number(period),
        records: groupRecords
      }))
      .sort((a, b) => a.period - b.period)

    for (const group of groups) {
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

    if (hotp.length > 0) {
      result.push({ type: 'hotp-header', key: 'hotp-header' })
      for (const record of hotp) {
        result.push({ type: 'record', key: record.id, record })
      }
    }

    return result
  }, [otpRecords])

  const renderItem = ({ item, index }) => {
    if (item.type === 'totp-header') {
      const firstRecord = item.records[0]
      const otpData = otpCodes[firstRecord?.id]
      const timeRemaining =
        otpData?.timeRemaining ?? firstRecord?.otpPublic?.timeRemaining ?? null
      const expiring = isExpiring(timeRemaining)

      return (
        <View>
          {index > 0 && <View style={styles.groupDivider} />}
          <View style={styles.groupHeader}>
            <TimerCircle timeRemaining={timeRemaining} period={item.period} />
            <Text style={styles.groupLabelText}>{t`Codes expiring in`} </Text>
            <Text
              style={[
                styles.groupTimeValue,
                { color: getTimerColor(expiring) }
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
          {index > 0 && <View style={styles.groupDivider} />}
          <View style={styles.groupHeader}>
            <Text style={styles.groupLabelText}>{t`Counter-based`}</Text>
          </View>
        </View>
      )
    }

    // Record item
    const { record } = item
    const otpData = otpCodes[record.id]
    const code = otpData?.code ?? record.otpPublic?.currentCode ?? null
    const websiteDomain =
      record.type === 'login' ? record?.data?.websites?.[0] : null

    return (
      <TouchableOpacity
        style={styles.recordItem}
        onPress={() => handleRecordPress(record)}
      >
        <AvatarRecord websiteDomain={websiteDomain} record={record} />
        <View style={styles.recordTextContainer}>
          <Text style={styles.recordTitle} numberOfLines={1}>
            {record.data?.title}
          </Text>
          <Text style={styles.recordSubText} numberOfLines={1}>
            {record.data?.username || record.folder}
          </Text>
        </View>
        <Text style={styles.otpCode}>{formatOtpCode(code)}</Text>
        <CopyButton value={code} />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        itemsFound={otpRecords.length}
        setIsMultiSelectOn={() => {}}
        isMultiSelectOn={false}
        setSelectedRecords={() => {}}
        selectedRecords={[]}
      />

      {otpRecords.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <LockIcon size="48" color={colors.grey100.mode1} />
          <Text
            style={styles.emptyStateTitle}
          >{t`No authenticator tokens`}</Text>
          <Text style={styles.emptyStateText}>
            {t`Add an authenticator secret key to a login record to see it here.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  )
}
