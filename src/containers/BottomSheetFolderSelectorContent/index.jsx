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
  CreateNewFolder,
  StarOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSharedFilter } from '../../context/SharedFilterContext'
import { SheetHeader } from '../BottomSheet/SheetHeader'
import { Layout } from '../Layout'

export const BottomSheetFolderSelectorContent = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
  const { state, setState } = useSharedFilter()
  const { bottom } = useSafeAreaInsets()

  const { data: folders } = useFolders()
  const { data: recordCountsByType } = useRecordCountsByType({})

  const customFolders = Object.values(folders?.customFolders ?? {})

  const handleSelect = (folderId, isFavorite = false) => {
    setState((prev) => ({ ...prev, folder: folderId, isFavorite }))
    collapse()
  }

  const handleCreateFolder = () => {
    collapse()
    navigation.navigate('CreateFolder')
  }

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={<SheetHeader title={t`Folders`} onClose={collapse} />}
    >
      <NavbarListItem
        icon={<FolderCopy color={theme.colors.colorTextPrimary} />}
        iconSize={16}
        label={t`All Folders`}
        count={recordCountsByType?.all}
        selected={state.folder === 'allFolder'}
        platform="mobile"
        showDivider
        onClick={() => handleSelect('allFolder')}
      />

      <NavbarListItem
        icon={<StarOutlined color={theme.colors.colorTextPrimary} />}
        iconSize={16}
        label={t`Favorites`}
        count={folders?.favorites?.records?.length}
        selected={state.folder === 'favorite'}
        platform="mobile"
        showDivider
        onClick={() => handleSelect('favorite', true)}
      />

      {customFolders.map((folder, index) => (
        <NavbarListItem
          key={folder.name}
          icon={<Folder color={theme.colors.colorTextPrimary} />}
          iconSize={16}
          label={folder.name}
          count={folder.records?.filter((r) => !!r.data).length ?? 0}
          selected={state.folder === folder.name}
          platform="mobile"
          showDivider={index < customFolders.length - 1}
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
