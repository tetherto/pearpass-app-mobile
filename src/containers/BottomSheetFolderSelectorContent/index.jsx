import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  Button,
  NavbarListItem,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  Close,
  FolderOutlined,
  StarOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'

import { createStyles } from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useSharedFilter } from '../../context/SharedFilterContext'
import { ContentContainer } from '../ContentContainer'

export const BottomSheetFolderSelectorContent = () => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { collapse } = useBottomSheet()
  const { state, setState } = useSharedFilter()
  const styles = createStyles(theme.colors)

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
    <ContentContainer scrollable contentStyle={{ padding: 0 }}>
      <View style={styles.header}>
        <Text variant="bodyEmphasized">{t`Folders`}</Text>
        <Button
          variant="tertiary"
          iconBefore={<Close color={theme.colors.colorTextPrimary} />}
          onClick={collapse}
          aria-label={t`Close`}
        />
      </View>

      <NavbarListItem
        icon={<FolderOutlined color={theme.colors.colorTextPrimary} />}
        label={t`All Folders`}
        count={recordCountsByType?.all}
        selected={state.folder === 'allFolder'}
        platform="mobile"
        showDivider
        onClick={() => handleSelect('allFolder')}
      />

      <NavbarListItem
        icon={<StarOutlined color={theme.colors.colorTextPrimary} />}
        label={t`Favorites`}
        count={folders?.favorites?.records?.length}
        selected={state.folder === 'favorite'}
        platform="mobile"
        showDivider
        onClick={() => handleSelect('favorite', true)}
      />

      {customFolders.map((folder) => (
        <NavbarListItem
          key={folder.name}
          icon={<FolderOutlined color={theme.colors.colorTextPrimary} />}
          label={folder.name}
          count={folder.records?.filter((r) => !!r.data).length ?? 0}
          selected={state.folder === folder.name}
          platform="mobile"
          showDivider
          onClick={() => handleSelect(folder.name)}
        />
      ))}

      <NavbarListItem
        icon={<Add color={theme.colors.colorTextPrimary} />}
        label={t`Add New Folder`}
        platform="mobile"
        onClick={handleCreateFolder}
      />
    </ContentContainer>
  )
}
