import { useContext } from 'react'

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
  FolderOpen,
  StarOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'

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
  const styles = createStyles()
  const insets = useContext(SafeAreaInsetsContext)
  const bottom = insets?.bottom ?? 0

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

  const handleColor = theme.colors.colorSurfaceElevatedOnInteraction

  return (
    <ContentContainer
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={
        <>
          <View style={styles.dragHandleArea}>
            <View
              style={[styles.dragHandle, { backgroundColor: handleColor }]}
            />
          </View>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text variant="bodyEmphasized" style={styles.headerTitle}>
              {t`Folders`}
            </Text>
            <Button
              variant="tertiary"
              size="medium"
              iconBefore={<Close color={theme.colors.colorTextPrimary} />}
              onClick={collapse}
              aria-label={t`Close`}
            />
          </View>
        </>
      }
    >
      <NavbarListItem
        icon={<FolderOpen color={theme.colors.colorTextPrimary} />}
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

      {customFolders.map((folder, index) => (
        <NavbarListItem
          key={folder.name}
          icon={<FolderOpen color={theme.colors.colorTextPrimary} />}
          label={folder.name}
          count={folder.records?.filter((r) => !!r.data).length ?? 0}
          selected={state.folder === folder.name}
          platform="mobile"
          showDivider={index < customFolders.length - 1}
          onClick={() => handleSelect(folder.name)}
        />
      ))}

      <NavbarListItem
        icon={<Add color={theme.colors.colorTextPrimary} />}
        label={t`Add New Folder`}
        platform="mobile"
        showDivider={false}
        onClick={handleCreateFolder}
      />
    </ContentContainer>
  )
}
