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
import { Layout } from '../../containers/Layout'
import { BackScreenHeader } from '../../containers/ScreenHeader/BackScreenHeader'
import { getRecordSubtitle } from '../../utils/getRecordSubtitle'

export const MultiSelectMove = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { params } = useRoute()
  const { theme } = useTheme()
  const [selectedFolder, setSelectedFolder] = useState(null)
  const styles = useMemo(() => createStyles(), [])

  const [containerHeight, setContainerHeight] = useState(0)
  const [recordsScrollableHeight, setRecordsScrollableHeight] = useState(0)
  const [recordsVisibleHeight, setRecordsVisibleHeight] = useState(0)
  const [folderLabelHeight, setFolderLabelHeight] = useState(0)
  const [folderButtonsHeight, setFolderButtonsHeight] = useState(0)
  const [foldersScrollableHeight, setFoldersScrollableHeight] = useState(0)
  const [foldersVisibleHeight, setFoldersVisibleHeight] = useState(0)
  const [listItemHeight, setListItemHeight] = useState(0)
  const [folderButtonHeight, setFolderButtonHeight] = useState(0)

  const half = containerHeight / 2
  // Math.ceil guards against sub-pixel truncation in onLayout measurements
  const foldersNaturalHeight = Math.ceil(
    rawTokens.spacing12 +
      folderLabelHeight +
      rawTokens.spacing8 +
      folderButtonsHeight +
      rawTokens.spacing12
  )
  const foldersAllocatedHeight =
    containerHeight > 0 && foldersNaturalHeight > half
      ? half
      : foldersNaturalHeight
  const recordsMaxHeight =
    containerHeight > 0 ? containerHeight - foldersAllocatedHeight : undefined

  const showRecordsGradient = recordsScrollableHeight > recordsVisibleHeight
  const showFoldersGradient = foldersScrollableHeight > foldersVisibleHeight

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
    <Layout
      header={
        <BackScreenHeader
          title={t`Move ${selectedRecordIds.length} Items`}
          onBack={() => navigation.goBack()}
        />
      }
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
            recordsMaxHeight !== undefined && { maxHeight: recordsMaxHeight }
          ]}
          onLayout={(e) => setRecordsVisibleHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.sectionLabel}>
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`Selected items`}
            </Text>
          </View>
          <ScrollView
            style={styles.recordsScroll}
            contentContainerStyle={[
              styles.recordsContent,
              showRecordsGradient &&
                listItemHeight > 0 && { paddingBottom: listItemHeight }
            ]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={(_, h) => setRecordsScrollableHeight(h)}
          >
            {selectedRecordObjects.map((record, index) => (
              <ListItem
                key={record.id}
                icon={<RecordItemIcon record={record} />}
                iconSize={32}
                title={record.data?.title ?? ''}
                subtitle={getRecordSubtitle(record) || undefined}
                style={styles.recordItem}
                onLayout={
                  index === 0
                    ? (e) => setListItemHeight(e.nativeEvent.layout.height)
                    : undefined
                }
              />
            ))}
          </ScrollView>
          {showRecordsGradient && (
            <FadeGradient
              color={theme.colors.colorSurfacePrimary}
              style={[styles.fadeGradient, { height: listItemHeight }]}
            />
          )}
        </View>

        <View style={styles.foldersSection}>
          <View
            style={styles.folderSectionLabel}
            onLayout={(e) => setFolderLabelHeight(e.nativeEvent.layout.height)}
          >
            <Text variant="caption" color={theme.colors.colorTextSecondary}>
              {t`Choose the destination folder for these items`}
            </Text>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              showFoldersGradient &&
              folderButtonHeight > 0 && { paddingBottom: folderButtonHeight }
            }
            onContentSizeChange={(_, h) => setFoldersScrollableHeight(h)}
            onLayout={(e) =>
              setFoldersVisibleHeight(e.nativeEvent.layout.height)
            }
          >
            <View
              style={styles.foldersList}
              onLayout={(e) =>
                setFolderButtonsHeight(e.nativeEvent.layout.height)
              }
            >
              {folderList.map((folder, index) => (
                <View
                  key={folder.name}
                  onLayout={
                    index === 0
                      ? (e) =>
                          setFolderButtonHeight(e.nativeEvent.layout.height)
                      : undefined
                  }
                >
                  <Button
                    variant="secondary"
                    fullWidth
                    iconBefore={<FolderOpen />}
                    onClick={() => setSelectedFolder(folder.name)}
                    pressed={selectedFolder === folder.name}
                    style={styles.folderButton}
                  >
                    {folder.name}
                  </Button>
                </View>
              ))}
            </View>
          </ScrollView>
          {showFoldersGradient && (
            <FadeGradient
              color={theme.colors.colorSurfacePrimary}
              style={[
                styles.foldersFadeGradient,
                { height: folderButtonHeight }
              ]}
            />
          )}
        </View>
      </View>
    </Layout>
  )
}
