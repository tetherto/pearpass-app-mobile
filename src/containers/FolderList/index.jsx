import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { AUTHENTICATOR_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  Folder as FolderIcon,
  LockOutlined,
  Add,
  StarFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { colors } from 'src/utils/colors'

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
        icon: (
          <FolderIcon width="26" height="26" color={colors.primary400.mode1} />
        )
      })) || []

    customFolders.push({
      name: t`Create new`,
      icon: <Add width="26" height="26" color={colors.primary400.mode1} />,
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
          icon: <StarFilled width="26" height="26" />
        },
        ...customFolders,
        ...(AUTHENTICATOR_ENABLED
          ? [
              {
                name: t`Authenticator`,
                id: 'authenticator',
                icon: (
                  <LockOutlined
                    width="26"
                    height="26"
                    color={colors.primary400.mode1}
                  />
                ),
                isAuthenticator: true
              }
            ]
          : [])
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
