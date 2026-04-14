import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  NavbarListItem,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  FolderCopy,
  Folder,
  CreateNewFolder
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSharedFilter } from '../../context/SharedFilterContext'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { Layout } from '../Layout'

export const BottomSheetFolderSelectorContent = ({
  selectedFolder,
  onSelect,
  includeSmartFolders = true
}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { state, setState } = useSharedFilter()
  const { bottom } = useSafeAreaInsets()

  const { data: folders } = useFolders()
  const { data: recordCountsByType } = useRecordCountsByType({})

  const customFolders = Object.values(folders?.customFolders ?? {})
  const activeFolder = selectedFolder ?? state.folder

  const handleSelect = (folderId) => {
    if (onSelect) {
      const folderName = folderId === 'allFolder' ? '' : folderId

      onSelect({
        id: folderId,
        name: folderName,
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

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Folders`} onClose={collapse} />}
    >
      {includeSmartFolders && (
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

      {customFolders.map((folder) => (
        <NavbarListItem
          key={folder.name}
          icon={<Folder color={theme.colors.colorTextPrimary} />}
          iconSize={16}
          label={folder.name}
          count={folder.records?.filter((r) => !!r.data).length ?? 0}
          selected={activeFolder === folder.name}
          platform="mobile"
          showDivider={true}
          onClick={() => handleSelect(folder.name)}
        />
      ))}

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
