import { useNavigation } from '@react-navigation/native'
import { generateAvatarInitials } from '@tetherto/pear-apps-utils-avatar-initials'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Share as ShareIcon } from '@tetherto/pearpass-lib-ui-kit/icons'
import { RECORD_TYPES, useRecordById } from '@tetherto/pearpass-lib-vault'
import { Share, StyleSheet, View } from 'react-native'

import { RecordDetailsContent } from './RecordDetailsContentWrapper'
import { HeaderContent } from './styles'
import { RECORD_COLOR_BY_TYPE } from '../../../constants/recordColorByType'
import { BottomSheetRecordActionsContentV2 } from '../../../containers/BottomSheetRecordActionsContent/BottomSheetRecordActionsContentV2'
import { BackScreenHeader } from '../../../containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from '../../../containers/ScreenLayout'

export const RecordDetailsV2 = ({ route }) => {
  const { recordId } = route.params
  const { theme } = useTheme()

  const { data: record } = useRecordById({
    variables: {
      id: recordId
    }
  })

  const navigation = useNavigation()

  if (!record) {
    return null
  }

  const handleShare = async () => {
    const website =
      record?.type === RECORD_TYPES.LOGIN ? record?.data?.websites?.[0] : null

    await Share.share({
      title: record?.data?.title || 'Record',
      message: [record?.data?.title, website].filter(Boolean).join('\n')
    })
  }

  return (
    <ScreenLayout
      scrollable
      contentStyle={styles.scrollContent}
      footerStyle={styles.hiddenFooter}
      header={
        <BackScreenHeader
          title={record?.data?.title || ''}
          onBack={() => navigation.goBack()}
          rightActions={
            <View style={styles.actionButtonsContainer}>
              <Button
                variant="tertiary"
                size="medium"
                aria-label="Share"
                iconBefore={<ShareIcon color={theme.colors.colorTextPrimary} />}
                onClick={handleShare}
              />
              <BottomSheetRecordActionsContentV2
                record={record}
                recordType={record.type}
                excludeTypes={['copy']}
                onDelete={() => navigation.goBack()}
              />
            </View>
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
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    flexGrow: 1
  },
  hiddenFooter: {
    display: 'none'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  headerIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
