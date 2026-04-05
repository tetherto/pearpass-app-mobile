import { useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Button,
  ListItem,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { FolderOpen } from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecords } from '@tetherto/pearpass-lib-vault'
import { ScrollView, View } from 'react-native'

import { createStyles } from './styles'
import { FadeGradient } from '../../components/FadeGradient'
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

  const [containerHeight, setContainerHeight] = useState(0)
  const [recordsContentHeight, setRecordsContentHeight] = useState(0)
  const [recordsLayoutHeight, setRecordsLayoutHeight] = useState(0)
  const [folderLabelHeight, setFolderLabelHeight] = useState(0)
  const [folderButtonsHeight, setFolderButtonsHeight] = useState(0)

  const half = containerHeight / 2
  // Math.ceil guards against sub-pixel truncation in onLayout measurements
  const foldersNaturalHeight = Math.ceil(
    rawTokens.spacing12 +
      folderLabelHeight +
      rawTokens.spacing8 +
      folderButtonsHeight +
      rawTokens.spacing12
  )
  const foldersExceedsHalf = containerHeight > 0 && foldersNaturalHeight > half
  const foldersMaxHeight = foldersExceedsHalf ? half : undefined
  const foldersNeeds = foldersExceedsHalf ? half : foldersNaturalHeight
  const recordsMaxHeight =
    containerHeight > 0 ? containerHeight - foldersNeeds : undefined

  const showRecordsGradient = recordsContentHeight > recordsLayoutHeight
  const showFoldersGradient = foldersExceedsHalf

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
        contentStyle={{ padding: 0 }}
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
        <View
          style={{ flex: 1 }}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        >
          <View
            style={[
              styles.recordsSection,
              recordsMaxHeight !== null && { maxHeight: recordsMaxHeight }
            ]}
            onLayout={(e) =>
              setRecordsLayoutHeight(e.nativeEvent.layout.height)
            }
          >
            <ScrollView
              style={styles.recordsScroll}
              contentContainerStyle={[
                styles.recordsContent,
                showRecordsGradient && { paddingBottom: 70 }
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
            {showRecordsGradient && (
              <FadeGradient
                color={theme.colors.colorSurfacePrimary}
                style={styles.fadeGradient}
              />
            )}
          </View>

          <View
            style={[
              styles.foldersSection,
              foldersMaxHeight !== null && { maxHeight: foldersMaxHeight }
            ]}
          >
            <View
              onLayout={(e) =>
                setFolderLabelHeight(e.nativeEvent.layout.height)
              }
            >
              <Text variant="caption" style={styles.sectionLabel}>
                {t`Choose the destination folder for these items`}
              </Text>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                showFoldersGradient && { paddingBottom: 70 }
              }
            >
              <View
                style={styles.foldersList}
                onLayout={(e) =>
                  setFolderButtonsHeight(e.nativeEvent.layout.height)
                }
              >
                {folderList.map((folder) => (
                  <Button
                    key={folder.name}
                    variant="secondary"
                    fullWidth
                    iconBefore={<FolderOpen />}
                    onClick={() => setSelectedFolder(folder.name)}
                    style={[
                      styles.folderButton,
                      { borderColor: theme.colors.colorBorderSecondary },
                      selectedFolder === folder.name && {
                        backgroundColor:
                          theme.colors.colorSurfaceElevatedOnInteraction
                      }
                    ]}
                  >
                    {folder.name}
                  </Button>
                ))}
              </View>
            </ScrollView>
            {showFoldersGradient && (
              <FadeGradient
                color={theme.colors.colorSurfacePrimary}
                style={styles.foldersFadeGradient}
              />
            )}
          </View>
        </View>
      </ContentContainer>
    </ScreenLayout>
  )
}
