import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, ListItem, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useRecords } from '@tetherto/pearpass-lib-vault'
import { ScrollView, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { createStyles } from './styles'
import { FadeGradient } from '../../components/FadeGradient'
import { RecordItemIcon } from '../../components/RecordItemIcon'
import { Layout } from '../../containers/Layout'
import { BackScreenHeader } from '../../containers/ScreenHeader/BackScreenHeader'
import { getRecordSubtitle } from '../../utils/getRecordSubtitle'

export const MultiSelectDelete = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { params } = useRoute()
  const { theme } = useTheme()
  const styles = createStyles(theme.colors)

  const [containerHeight, setContainerHeight] = useState(0)
  const [confirmTextHeight, setConfirmTextHeight] = useState(0)
  const [recordsContentHeight, setRecordsContentHeight] = useState(0)
  const [recordsLayoutHeight, setRecordsLayoutHeight] = useState(0)
  const [listItemHeight, setListItemHeight] = useState(0)

  const showGradient = recordsContentHeight > recordsLayoutHeight

  const recordsMaxHeight =
    containerHeight > 0 ? containerHeight - confirmTextHeight : undefined

  const { selectedRecordIds, selectedRecordObjects, onComplete, isOtpContext } =
    params

  const { deleteRecords, updateRecords } = useRecords({
    onCompleted: () => {
      onComplete?.()
      navigation.goBack()
    }
  })
  const isSingleRecord = selectedRecordIds.length === 1
  const isSingleLoginInOtpContext =
    isOtpContext &&
    isSingleRecord &&
    selectedRecordObjects?.[0]?.type === 'login'

  const handleStripOtp = async () => {
    const record = selectedRecordObjects[0]
    const data = { ...record?.data }
    delete data.otpInput
    delete data.otp
    const updatedRecord = { ...record }
    // otpPublic is computed at read time and never stored, but explicitly removing it
    // prevents any accidental write-through if the vault layer changes its whitelist.
    delete updatedRecord.otpPublic
    try {
      await updateRecords([{ ...updatedRecord, data }])
    } catch (err) {
      Toast.show({
        type: 'baseToast',
        text1: err?.message ?? t`Failed to remove authenticator code`,
        position: 'bottom',
        bottomOffset: 100
      })
    }
  }

  return (
    <Layout
      header={
        <BackScreenHeader
          title={
            isSingleLoginInOtpContext
              ? t`Remove Authenticator Code`
              : isSingleRecord
                ? t`Delete ${selectedRecordIds.length} Item`
                : t`Delete ${selectedRecordIds.length} Items`
          }
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={{ padding: 0 }}
      footer={
        <Button
          variant="destructive"
          fullWidth
          onClick={
            isSingleLoginInOtpContext
              ? handleStripOtp
              : () => deleteRecords(selectedRecordIds)
          }
        >
          {isSingleRecord ? t`Delete Item` : t`Delete Items`}
        </Button>
      }
    >
      <View
        style={styles.container}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        <View
          style={[
            styles.recordsSection,
            recordsMaxHeight !== undefined && { maxHeight: recordsMaxHeight }
          ]}
        >
          <Text variant="caption" style={styles.sectionLabel}>
            {isSingleRecord ? t`Selected item` : t`Selected items`}
          </Text>
          <ScrollView
            style={styles.recordsScroll}
            onLayout={(e) =>
              setRecordsLayoutHeight(e.nativeEvent.layout.height)
            }
            contentContainerStyle={[
              styles.recordsContent,
              showGradient &&
                listItemHeight > 0 && { paddingBottom: listItemHeight }
            ]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={(_, h) => setRecordsContentHeight(h)}
          >
            {selectedRecordObjects.map((record, index) => (
              <View
                key={record.id}
                onLayout={
                  index === 0
                    ? (e) => setListItemHeight(e.nativeEvent.layout.height)
                    : undefined
                }
              >
                <ListItem
                  icon={<RecordItemIcon record={record} />}
                  iconSize={32}
                  title={record.data?.title ?? ''}
                  subtitle={getRecordSubtitle(record) || undefined}
                  style={styles.recordItem}
                />
              </View>
            ))}
          </ScrollView>
          {showGradient && (
            <FadeGradient
              color={theme.colors.colorSurfacePrimary}
              style={[styles.fadeGradient, { height: listItemHeight }]}
            />
          )}
        </View>
        <View
          onLayout={(e) => setConfirmTextHeight(e.nativeEvent.layout.height)}
        >
          <Text variant="caption" style={styles.confirmText}>
            {isSingleRecord
              ? t`Are you sure to delete the selected item?`
              : t`Are you sure to delete the selected items?`}
          </Text>
        </View>
      </View>
    </Layout>
  )
}
