import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  FolderIcon,
  PlusIcon,
  StarIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useFolders, useRecordCountsByType } from 'pearpass-lib-vault'

import { FoldersContainer } from './styles'
import { Folder } from '../../components/Folder'
import { LogoLock } from '../../svgs/LogoLock'

/**
 * @param {{
 *  onFolderSelect: (folder: any) => void
 *  selectedFolder: string
 *  isFilter: boolean
 * }} props
 */
export const FolderList = ({
  onFolderSelect,
  selectedFolder,
  isFilter,
  onLongPress
}) => {
  const { t } = useLingui()
  const { data: recordCountsByType } = useRecordCountsByType({})
  const { data: folders } = useFolders()
  const navigation = useNavigation()

  const otherFolders = useMemo(
    () => Object.values(folders.customFolders ?? {}),
    [folders]
  )

  const filteredFolderList = useMemo(() => {
    const customFolders =
      otherFolders?.map((folder) => ({
        name: folder.name,
        count: folder.records.filter((record) => !!record.data).length,
        icon: <FolderIcon size="26" color={colors.primary400.mode1} />
      })) || []

    customFolders.push({
      name: t`Create new`,
      icon: <PlusIcon size="26" color={colors.primary400.mode1} />,
      isCreateNew: true
    })

    if (isFilter) {
      return [
        {
          name: t`All Items`,
          id: 'allFolder',
          count: recordCountsByType?.all,
          icon: <LogoLock width="26" height="36" />
        },
        {
          name: t`Favorites`,
          id: 'favorite',
          count: folders?.favorites?.records.length || 0,
          icon: <StarIcon size="26" />
        },
        ...customFolders
      ]
    }

    return customFolders
  }, [isFilter, otherFolders])

  const handleCreateNewFolder = () => {
    if (isFilter) {
      navigation.navigate('CreateFolder')

      return
    }

    navigation.navigate('CreateFolder', {
      onGoBack: ({ folder }) => onFolderSelect({ name: folder })
    })
  }

  return (
    <FoldersContainer>
      {filteredFolderList.map((folder, index) => (
        <Folder
          key={folder.name}
          onFolderSelect={(folder) => onFolderSelect(folder)}
          onLongPress={() => onLongPress?.(folder.name)}
          onCreateNewFolder={handleCreateNewFolder}
          folder={folder}
          isLast={index === filteredFolderList.length - 1}
          isFilter={isFilter}
          isActive={
            selectedFolder &&
            (selectedFolder === folder.name || selectedFolder === folder.id)
          }
        />
      ))}
    </FoldersContainer>
  )
}
