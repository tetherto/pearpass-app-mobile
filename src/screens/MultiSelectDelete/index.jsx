import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { useRecords } from '@tetherto/pearpass-lib-vault'
import { ScrollView, View } from 'react-native'

import { createStyles } from './styles'
import { RecordItemRow } from '../../components/RecordItemRow'
import { ContentContainer } from '../../containers/ContentContainer'
import { BackScreenHeader } from '../../containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from '../../containers/ScreenLayout'

export const MultiSelectDelete = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { params } = useRoute()
  const { theme } = useTheme()
  const styles = createStyles(theme.colors)

  const { selectedRecordIds, selectedRecordObjects } = params

  const { deleteRecords } = useRecords({
    onCompleted: () => navigation.goBack()
  })

  return (
    <ScreenLayout
      header={
        <BackScreenHeader
          title={`${t`Delete`} ${selectedRecordIds.length} ${t`Items`}`}
          onBack={() => navigation.goBack()}
        />
      }
      contentStyle={{
        paddingHorizontal: 0,
        backgroundColor: theme.colors.colorBackground
      }}
    >
      <ContentContainer>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text variant="caption" style={styles.sectionLabel}>
              {t`Selected items`}
            </Text>
            {selectedRecordObjects.map((record) => (
              <RecordItemRow
                key={record.id}
                record={record}
                style={styles.recordItem}
              />
            ))}
          </View>
          <Text variant="caption" style={styles.confirmText}>
            {t`Are you sure to delete the selected items?`}
          </Text>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            variant="destructive"
            fullWidth
            onClick={() => deleteRecords(selectedRecordIds)}
          >
            {t`Delete Items`}
          </Button>
        </View>
      </ContentContainer>
    </ScreenLayout>
  )
}
