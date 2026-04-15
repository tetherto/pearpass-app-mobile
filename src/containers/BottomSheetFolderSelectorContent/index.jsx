import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  NavbarListItem,
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
          <NavbarListItem
            key={folder.name}
            icon={<Folder color={theme.colors.colorTextPrimary} />}
            iconSize={16}
            label={folder.name}
            count={count}
            selected={isSelected}
            platform="mobile"
            showDivider
            onClick={() => handleSelect(folder.name)}
            additionalItems={
              <Button
                variant="tertiary"
                size="small"
                aria-label={t`Folder actions`}
                iconBefore={<MoreVert color={theme.colors.colorTextPrimary} />}
                onClick={() => setMenuFolderName(folder.name)}
              />
            }
          />
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
