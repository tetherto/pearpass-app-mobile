import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { FolderOutlined } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecords } from '@tetherto/pearpass-lib-vault'
import { Pressable, ScrollView, View } from 'react-native'

import { createStyles } from './styles'
import { RecordItemRow } from '../../components/RecordItemRow'
import { ContentContainer } from '../../containers/ContentContainer'
import { BackScreenHeader } from '../../containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from '../../containers/ScreenLayout'

export const MultiSelectMove = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { params } = useRoute()
  const { theme } = useTheme()
  const [selectedFolder, setSelectedFolder] = useState(null)
  const styles = createStyles(theme.colors)

  const { selectedRecordIds, selectedRecordObjects, onComplete } = params

  const { data: folders } = useFolders()
  const { updateFolder } = useRecords({
    onCompleted: () => {
      onComplete?.()
      navigation.goBack()
    }
  })

  const folderList = useMemo(
    () => Object.values(folders.customFolders ?? {}),
    [folders]
  )

  const handleMove = async () => {
    if (!selectedFolder) return
    await updateFolder(selectedRecordIds, selectedFolder)
  }

  return (
    <ScreenLayout
      header={
        <BackScreenHeader
          title={`${t`Move`} ${selectedRecordIds.length} ${t`Items`}`}
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
          <View style={styles.folderSection}>
            <Text variant="caption" style={styles.sectionLabel}>
              {t`Choose the destination folder of this items`}
            </Text>
            <View style={styles.folderList}>
              {folderList.map((folder) => (
                <Pressable
                  key={folder.name}
                  style={[
                    styles.folderItem,
                    selectedFolder === folder.name && styles.folderItemSelected
                  ]}
                  onPress={() => setSelectedFolder(folder.name)}
                >
                  <FolderOutlined
                    width={16}
                    height={16}
                    color={theme.colors.colorTextPrimary}
                  />
                  <Text variant="label">{folder.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            variant="primary"
            fullWidth
            disabled={!selectedFolder}
            onClick={handleMove}
          >
            {t`Move Items`}
          </Button>
        </View>
      </ContentContainer>
    </ScreenLayout>
  )
}
