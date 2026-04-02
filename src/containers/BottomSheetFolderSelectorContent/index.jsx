import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { Button, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  Check,
  Close,
  FolderOutlined,
  StarOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { Pressable, View } from 'react-native'

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

      <Pressable
        style={[styles.item, state.folder === 'allFolder' && styles.itemActive]}
        onPress={() => handleSelect('allFolder')}
      >
        <FolderOutlined
          width={16}
          height={16}
          color={theme.colors.colorTextPrimary}
        />
        <Text variant="label" style={styles.itemLabel}>
          {t`All Folders`}
        </Text>
        <Text variant="label" style={styles.count}>
          {recordCountsByType?.all ?? ''}
        </Text>
        {state.folder === 'allFolder' && (
          <Check width={16} height={16} color={theme.colors.colorTextPrimary} />
        )}
      </Pressable>

      <Pressable
        style={[styles.item, state.folder === 'favorite' && styles.itemActive]}
        onPress={() => handleSelect('favorite', true)}
      >
        <StarOutlined
          width={16}
          height={16}
          color={theme.colors.colorTextPrimary}
        />
        <Text variant="label" style={styles.itemLabel}>
          {t`Favorites`}
        </Text>
        <Text variant="label" style={styles.count}>
          {folders?.favorites?.records?.length ?? ''}
        </Text>
        {state.folder === 'favorite' && (
          <Check width={16} height={16} color={theme.colors.colorTextPrimary} />
        )}
      </Pressable>

      {customFolders.map((folder) => {
        const isActive = state.folder === folder.name
        const count = folder.records?.filter((r) => !!r.data).length ?? 0
        return (
          <Pressable
            key={folder.name}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => handleSelect(folder.name)}
          >
            <FolderOutlined
              width={16}
              height={16}
              color={theme.colors.colorTextPrimary}
            />
            <Text variant="label" style={styles.itemLabel}>
              {folder.name}
            </Text>
            <Text variant="label" style={styles.count}>
              {count}
            </Text>
            {isActive && (
              <Check
                width={16}
                height={16}
                color={theme.colors.colorTextPrimary}
              />
            )}
          </Pressable>
        )
      })}

      <Pressable style={styles.item} onPress={handleCreateFolder}>
        <Add width={16} height={16} color={theme.colors.colorTextPrimary} />
        <Text variant="label" style={styles.itemLabel}>
          {t`Add New Folder`}
        </Text>
      </Pressable>
    </ContentContainer>
  )
}
