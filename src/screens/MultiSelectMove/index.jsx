import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Button,
  ListItem,
  NavbarListItem,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { FolderOpen } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecords } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'

import { createStyles } from './styles'
import { RecordItemIcon } from '../../components/RecordItemIcon'
import { ContentContainer } from '../../containers/ContentContainer'
import { BackScreenHeader } from '../../containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from '../../containers/ScreenLayout'
import { getRecordSubtitle } from '../../utils/getRecordSubtitle'

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
    () => Object.values(folders?.customFolders ?? {}),
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
      <ContentContainer
        scrollable
        contentStyle={{
          paddingVertical: rawTokens.spacing12,
          gap: rawTokens.spacing24
        }}
        footer={
          <Button
            variant="primary"
            fullWidth
            disabled={!selectedFolder}
            onClick={handleMove}
          >
            {t`Move Items`}
          </Button>
        }
      >
        <View style={styles.section}>
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
        </View>
        <View style={styles.folderSection}>
          <Text variant="caption" style={styles.sectionLabel}>
            {t`Choose the destination folder for these items`}
          </Text>
          <View style={styles.folderList}>
            {folderList.map((folder) => (
              <NavbarListItem
                key={folder.name}
                icon={<FolderOpen color={theme.colors.colorTextPrimary} />}
                label={folder.name}
                selected={selectedFolder === folder.name}
                onClick={() => setSelectedFolder(folder.name)}
              />
            ))}
          </View>
        </View>
      </ContentContainer>
    </ScreenLayout>
  )
}
