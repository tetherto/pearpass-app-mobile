import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, ListItem, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useRecords } from '@tetherto/pearpass-lib-vault'
import { ScrollView, View } from 'react-native'

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

  const [recordsContentHeight, setRecordsContentHeight] = useState(0)
  const [recordsLayoutHeight, setRecordsLayoutHeight] = useState(0)

  const showGradient = recordsContentHeight > recordsLayoutHeight

  const { selectedRecordIds, selectedRecordObjects, onComplete } = params

  const { deleteRecords } = useRecords({
    onCompleted: () => {
      onComplete?.()
      navigation.goBack()
    }
  })

  return (
    <Layout
      header={
        <BackScreenHeader
          title={`${t`Delete`} ${selectedRecordIds.length} ${t`Items`}`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={{ padding: 0 }}
      footer={
        <Button
          variant="destructive"
          fullWidth
          onClick={() => deleteRecords(selectedRecordIds)}
        >
          {t`Delete Items`}
        </Button>
      }
    >
      <View
        style={styles.recordsSection}
        onLayout={(e) => setRecordsLayoutHeight(e.nativeEvent.layout.height)}
      >
        <ScrollView
          style={styles.recordsScroll}
          contentContainerStyle={[
            styles.recordsContent,
            showGradient && { paddingBottom: 70 }
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(_, h) => setRecordsContentHeight(h)}
        >
          <Text variant="caption" style={styles.sectionLabel}>
            {t`Selected items`}
          </Text>
          {selectedRecordObjects.map((record) => (
            <ListItem
              key={record.id}
              icon={<RecordItemIcon record={record} />}
              iconSize={32}
              title={record.data?.title ?? ''}
              subtitle={getRecordSubtitle(record) || undefined}
              style={styles.recordItem}
            />
          ))}
        </ScrollView>
        {showGradient && (
          <FadeGradient
            color={theme.colors.colorSurfacePrimary}
            style={styles.fadeGradient}
          />
        )}
      </View>
      <Text variant="caption" style={styles.confirmText}>
        {t`Are you sure to delete the selected items?`}
      </Text>
    </Layout>
  )
}
