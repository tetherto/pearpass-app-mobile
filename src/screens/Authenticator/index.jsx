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
import { FlatList, View } from 'react-native'

import {
  Container,
  EmptyStateContainer,
  EmptyStateText,
  EmptyStateTitle,
  GroupDivider,
  GroupHeader,
  GroupLabelText,
  GroupTimeValue,
  OtpCode,
  RecordItem,
  RecordSubText,
  RecordTextContainer,
  RecordTitle
} from './styles'
import { AvatarRecord } from '../../components/AvatarRecord'
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
          {index > 0 && <GroupDivider />}
          <GroupHeader>
            <TimerCircle timeRemaining={timeRemaining} period={item.period} />
            <GroupLabelText>{t`Codes expiring in`} </GroupLabelText>
            <GroupTimeValue $expiring={expiring}>
              {timeRemaining !== null ? `${timeRemaining}s` : `${item.period}s`}
            </GroupTimeValue>
          </GroupHeader>
        </View>
      )
    }

    if (item.type === 'hotp-header') {
      return (
        <View>
          {index > 0 && <GroupDivider />}
          <GroupHeader>
            <GroupLabelText>{t`Counter-based`}</GroupLabelText>
          </GroupHeader>
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
      <RecordItem onPress={() => handleRecordPress(record)}>
        <AvatarRecord websiteDomain={websiteDomain} record={record} />
        <RecordTextContainer>
          <RecordTitle numberOfLines={1}>{record.data?.title}</RecordTitle>
          <RecordSubText numberOfLines={1}>
            {record.data?.username || record.folder}
          </RecordSubText>
        </RecordTextContainer>
        <OtpCode>{formatOtpCode(code)}</OtpCode>
        <CopyButton value={code} />
      </RecordItem>
    )
  }

  return (
    <Container>
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
        <EmptyStateContainer>
          <LockIcon size="48" color={colors.grey100.mode1} />
          <EmptyStateTitle>{t`No authenticator tokens`}</EmptyStateTitle>
          <EmptyStateText>
            {t`Add an authenticator secret key to a login record to see it here.`}
          </EmptyStateText>
        </EmptyStateContainer>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      )}
    </Container>
  )
}
