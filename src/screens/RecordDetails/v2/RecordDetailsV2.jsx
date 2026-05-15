import { useEffect, useRef } from 'react'

import { useNavigation } from '@react-navigation/native'
import { generateAvatarInitials } from '@tetherto/pear-apps-utils-avatar-initials'
import { rawTokens, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useRecordById } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, View } from 'react-native'

import { RecordDetailsContent } from './RecordDetailsContentWrapper'
import { HeaderContent } from './styles'
import { RECORD_COLOR_BY_TYPE } from '../../../constants/recordColorByType'
import { BottomSheetRecordActionsContentV2 } from '../../../containers/BottomSheetRecordActionsContent/BottomSheetRecordActionsContentV2'
import { Layout } from '../../../containers/Layout'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'

export const RecordDetailsV2 = ({ route }) => {
  const { recordId, isOtpContext: routeIsOtpContext } = route.params
  // `RECORD_TYPES.OTP` is `undefined` (a sentinel for Authenticator screens),
  // so comparing route params against it false-positives whenever a caller
  // omits recordType. Callers from the Authenticator screen pass an explicit
  // `isOtpContext: true` route param instead.
  const isOtpContext = !!routeIsOtpContext
  const { theme } = useTheme()

  const { data: record } = useRecordById({
    variables: {
      id: recordId
    }
  })

  const navigation = useNavigation()

  const hadRecordRef = useRef(false)
  useEffect(() => {
    if (record) {
      hadRecordRef.current = true
      return
    }

    if (hadRecordRef.current && navigation.canGoBack()) {
      navigation.goBack()
    }
  }, [record, navigation])

  if (!record) {
    return null
  }

  return (
    <Layout
      scrollable
      contentStyle={styles.scrollContent}
      footerStyle={styles.hiddenFooter}
      header={
        <BackScreenHeader
          title={record?.data?.title || ''}
          onBack={() => navigation.goBack()}
          rightActions={
            <BottomSheetRecordActionsContentV2
              record={record}
              recordType={record.type}
              excludeTypes={['copy']}
              onDelete={() => navigation.goBack()}
              isOtpContext={isOtpContext}
            />
          }
          centerSlot={
            <HeaderContent>
              <View style={styles.headerTitleRow}>
                <View
                  style={[
                    styles.headerIcon,
                    { backgroundColor: theme.colors.colorSurfaceHover }
                  ]}
                >
                  <Text
                    variant="bodyEmphasized"
                    style={[
                      styles.headerIconText,
                      {
                        color:
                          RECORD_COLOR_BY_TYPE[record.type] ||
                          theme.colors.colorTextPrimary
                      }
                    ]}
                  >
                    {generateAvatarInitials(record?.data?.title)}
                  </Text>
                </View>

                <View style={styles.headerTitleWrapper}>
                  <Text variant="bodyEmphasized" numberOfLines={1}>
                    {record?.data?.title || ''}
                  </Text>
                </View>
              </View>
            </HeaderContent>
          }
        />
      }
    >
      <RecordDetailsContent record={record} selectedFolder={record?.folder} />
    </Layout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: rawTokens.spacing16,
    flexGrow: 1
  },
  hiddenFooter: {
    display: 'none'
  },
  headerIcon: {
    width: rawTokens.spacing24,
    height: rawTokens.spacing24,
    borderRadius: rawTokens.spacing6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    minWidth: 0,
    flex: 1
  },
  headerTitleWrapper: {
    flex: 1,
    minWidth: 0
  },
  headerIconText: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '700'
  }
})
