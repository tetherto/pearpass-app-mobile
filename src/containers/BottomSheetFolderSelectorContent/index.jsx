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
  MoreVert,
  StarOutlined
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
  includeAllFolders = true,
  includeFavorites = true
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

  const customFolders = Object.values(folders?.customFolders ?? {}).sort(
    (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )
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

  const handleSelectFavorites = () => {
    if (onSelect) {
      onSelect({
        id: 'favorite',
        name: 'favorite',
        isFavorite: true
      })
    } else {
      setState((prev) => ({ ...prev, folder: 'favorite', isFavorite: true }))
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

      {includeFavorites && (
        <NavbarListItem
          icon={<StarOutlined color={theme.colors.colorTextPrimary} />}
          iconSize={16}
          label={t`Favorites`}
          count={folders?.favorites?.records?.length ?? 0}
          selected={activeFolder === 'favorite'}
          platform="mobile"
          showDivider
          onClick={handleSelectFavorites}
        />
      )}

      {customFolders.map(({ name: folderName, records }) => {
        const count = records?.filter((record) => !!record.data).length ?? 0
        const isSelected = activeFolder === folderName
        const itemColor = isSelected
          ? theme.colors.colorTextPrimary
          : theme.colors.colorTextSecondary

        return (
          <NavbarListItem
            key={folderName}
            icon={<Folder color={itemColor} />}
            iconSize={16}
            label={folderName}
            count={count}
            selected={isSelected}
            variant={isSelected ? 'default' : 'secondary'}
            platform="mobile"
            showDivider
            onClick={() => handleSelect(folderName)}
            additionalItems={
              <Button
                variant="tertiary"
                size="small"
                aria-label={t`Folder actions`}
                iconBefore={<MoreVert color={itemColor} />}
                onClick={() => setMenuFolderName(folderName)}
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
