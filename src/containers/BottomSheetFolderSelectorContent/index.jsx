import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  NavbarListItem,
  Text,
  rawTokens,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  CreateNewFolder,
  Folder,
  FolderCopy,
  MoreVert
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSharedFilter } from '../../context/SharedFilterContext'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { BottomSheetFolderMenuContentV2 } from '../BottomSheetFolderMenuContent/BottomSheetFolderMenuContentV2'
import { Layout } from '../Layout'

export const BottomSheetFolderSelectorContent = ({
  selectedFolder,
  onSelect,
  includeAllFolders = true
}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { state, setState } = useSharedFilter()
  const { bottom } = useSafeAreaInsets()
  const [menuFolderName, setMenuFolderName] = useState(null)

  const { data: folders } = useFolders()
  const { data: recordCountsByType } = useRecordCountsByType({})

  const customFolders = Object.values(folders?.customFolders ?? {})
  const activeFolder = selectedFolder ?? state.folder

  const navigateAfterClose = (routeName, params) => {
    collapse()

    requestAnimationFrame(() => {
      navigation.navigate(routeName, params)
    })
  }

  const handleSelect = (folderId) => {
    if (onSelect) {
      onSelect({
        id: folderId,
        name: folderId,
        isFavorite: false
      })
    } else {
      setState((prev) => ({ ...prev, folder: folderId, isFavorite: false }))
    }

    collapse()
  }

  const handleCreateFolder = () => {
    collapse()

    if (onSelect) {
      navigation.navigate('CreateFolder', {
        onGoBack: ({ folder }) =>
          onSelect({
            id: folder,
            name: folder,
            isFavorite: false
          })
      })
      return
    }

    navigation.navigate('CreateFolder')
  }

  const handleRenameFolder = (folderName) => {
    navigateAfterClose('CreateFolder', {
      initialValues: { title: folderName }
    })
  }

  const handleDeleteFolder = (folderName) => {
    navigateAfterClose('DeleteFolder', {
      folderName
    })
  }

  if (menuFolderName) {
    return (
      <Layout
        mode="sheet"
        scrollable
        contentStyle={{ padding: 0, paddingBottom: bottom }}
      >
        <BottomSheetFolderMenuContentV2
          folderName={menuFolderName}
          onBack={() => setMenuFolderName(null)}
          onClose={collapse}
          onRename={handleRenameFolder}
          onDelete={handleDeleteFolder}
        />
      </Layout>
    )
  }

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Folders`} onClose={collapse} />}
    >
      {includeAllFolders && (
        <NavbarListItem
          icon={<FolderCopy color={theme.colors.colorTextPrimary} />}
          iconSize={16}
          label={t`All Folders`}
          count={recordCountsByType?.all}
          selected={activeFolder === 'allFolder'}
          platform="mobile"
          showDivider
          onClick={() => handleSelect('allFolder')}
        />
      )}

      {customFolders.map((folder) => {
        const count =
          folder.records?.filter((record) => !!record.data).length ?? 0
        const isSelected = activeFolder === folder.name

        return (
          <View
            key={folder.name}
            style={[
              styles.row,
              {
                backgroundColor: isSelected
                  ? theme.colors.colorSurfaceHover
                  : theme.colors.colorSurfacePrimary,
                borderBottomColor: theme.colors.colorBorderSecondary
              }
            ]}
          >
            <Pressable
              style={styles.rowMain}
              onPress={() => handleSelect(folder.name)}
            >
              <View style={styles.rowLabelWrap}>
                <Folder
                  color={theme.colors.colorTextPrimary}
                  width={16}
                  height={16}
                />
                <Text
                  style={[
                    styles.rowLabel,
                    { color: theme.colors.colorTextPrimary }
                  ]}
                >
                  {folder.name}
                </Text>
              </View>

              <Text
                style={[styles.count, { color: theme.colors.colorTextPrimary }]}
              >
                {count}
              </Text>
            </Pressable>

            <Button
              variant="tertiary"
              size="small"
              aria-label={t`Folder actions`}
              iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
              onClick={() => setMenuFolderName(folder.name)}
            />
          </View>
        )
      })}

      <NavbarListItem
        icon={<CreateNewFolder color={theme.colors.colorTextPrimary} />}
        iconSize={16}
        label={t`Add New Folder`}
        platform="mobile"
        showDivider={false}
        onClick={handleCreateFolder}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingLeft: rawTokens.spacing12,
    paddingRight: rawTokens.spacing8
  },
  rowMain: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: rawTokens.spacing12,
    paddingRight: rawTokens.spacing8
  },
  rowLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing12,
    flex: 1,
    minWidth: 0
  },
  rowLabel: {
    flexShrink: 1,
    fontSize: rawTokens.fontSize14,
    fontWeight: rawTokens.weightMedium
  },
  count: {
    minWidth: rawTokens.spacing16,
    fontSize: rawTokens.fontSize14,
    fontWeight: rawTokens.weightMedium,
    textAlign: 'right'
  }
})
