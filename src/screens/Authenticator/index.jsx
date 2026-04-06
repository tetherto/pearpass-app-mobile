import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  PlusIcon,
  SaveIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import {
  formatOtpCode,
  groupOtpRecords,
  isExpiring,
  useRecords
} from '@tetherto/pearpass-lib-vault'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { isV2 } from 'src/utils/designVersion'

import { styles } from './styles'
import { AvatarRecord } from '../../components/AvatarRecord'
import { getTimerColor } from '../../components/OtpCodeField/utils'
import { TimerCircle } from '../../components/TimerCircle'
import { Header } from '../../containers/Header'
import { ScreenLayout } from '../../containers/ScreenLayout'
import { CopyButton } from '../../libComponents/CopyButton'
import { AuthenticatorIllustration } from '../../svgs/AuthenticatorIllustration'

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

  const handleRecordPress = (record) => {
    navigation.navigate('RecordDetails', { recordId: record.id })
  }

  const sections = useMemo(() => {
    const { totpGroups, hotpRecords } = groupOtpRecords(otpRecords)

    const result = []

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

  const renderItem = ({ item, index }) => {
    if (item.type === 'totp-header') {
      const firstRecord = item.records[0]
      const timeRemaining = firstRecord?.otpPublic?.timeRemaining ?? null
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
    const code = record.otpPublic?.currentCode ?? null

    return (
      <TouchableOpacity
        style={styles.recordItem}
        onPress={() => handleRecordPress(record)}
      >
        <AvatarRecord record={record} />
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

  const Wrapper = isV2() ? ScreenLayout : SafeAreaView
  const wrapperProps = isV2()
    ? {
        header: (
          <Header
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            itemsFound={otpRecords.length}
            setIsMultiSelectOn={() => {}}
            isMultiSelectOn={false}
            setSelectedRecords={() => {}}
            selectedRecords={[]}
          />
        ),
        hideFooter: true
      }
    : { style: styles.container }

  return (
    <Wrapper {...wrapperProps}>
      {!isV2() && (
        <Header
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          itemsFound={otpRecords.length}
          setIsMultiSelectOn={() => {}}
          isMultiSelectOn={false}
          setSelectedRecords={() => {}}
          selectedRecords={[]}
        />
      )}

      {otpRecords.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <AuthenticatorIllustration width="100%" height={140} />

          <View style={styles.emptyTextGroup}>
            <Text style={styles.emptyStateTitle}>{t`No codes saved`}</Text>
            <Text style={styles.emptyStateText}>
              {t`Save your first authenticator code or import your codes from another authenticator app.`}
            </Text>
          </View>

          <View style={styles.emptyCTAs}>
            <TouchableOpacity
              style={styles.emptyPrimaryButton}
              onPress={() =>
                navigation.navigate('CreateRecord', { recordType: 'login' })
              }
            >
              <PlusIcon size="16" color={colors.grey500.mode1} />
              <Text style={styles.emptyPrimaryButtonText}>{t`Add Code`}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.emptySecondaryButton}
              onPress={() =>
                navigation.navigate('Settings', { screen: 'Vaults' })
              }
            >
              <SaveIcon size="16" color={colors.primary400.mode1} />
              <Text
                style={styles.emptySecondaryButtonText}
              >{t`Import Codes`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
        />
      )}
    </Wrapper>
  )
}
