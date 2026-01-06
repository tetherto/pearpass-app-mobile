import { useLingui } from '@lingui/react/macro'
import {
  CheckIcon,
  KebabMenuIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'

import {
  FolderContainer,
  FolderContent,
  FolderCount,
  FolderText,
  FolderWrapper
} from './styles'
import { useBottomSheet } from '../../context/BottomSheetContext'

/**
 *
 * @param {{
 *  folder: any
 *  isLast: boolean
 *  onFolderSelect: (folder: any) => void
 *  onCreateNewFolder: () => void
 *  isFilter: boolean
 *  isActive: boolean
 * }} props
 * @returns
 */
export const Folder = ({
  folder,
  isLast,
  onFolderSelect,
  onLongPress,
  onCreateNewFolder,
  isActive
}) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()

  const handlePress = () => {
    collapse()

    if (folder.isCreateNew) {
      onCreateNewFolder()
      return
    }

    onFolderSelect(folder)
  }

  const getTestID = () => {
    if (folder.id === 'allFolder') return 'sidebar-all-folders'
    if (folder.id === 'favorite') return 'sidebar-favorites'
    if (folder.isCreateNew) return 'sidebar-create-new'
    if (folder.id || folder.name) {
      const folderId = folder.id || folder.name
      return `sidebar-folder-${folderId}`
    }
    return undefined
  }

  const getAccessibilityLabel = () => {
    if (folder.id === 'allFolder') return 'sidebar-all-folders'
    if (folder.id === 'favorite') return 'sidebar-favorites'
    if (folder.isCreateNew) return 'sidebar-create-new'
    if (folder.id || folder.name) {
      const folderId = folder.id || folder.name
      return `sidebar-folder-${folderId}`
    }
    return undefined
  }

  const getCountTestID = () => {
    if (folder.id === 'allFolder') return 'sidebar-all-folders-count'
    if (folder.id === 'favorite') return 'sidebar-favorites-count'
    if (folder.id || folder.name) {
      const folderId = folder.id || folder.name
      return `sidebar-folder-${folderId}-count`
    }
    return undefined
  }

  const getActiveCheckTestID = () => {
    if (folder.id === 'allFolder') return 'sidebar-all-folders-active'
    if (folder.id === 'favorite') return 'sidebar-favorites-active'
    if (folder.isCreateNew) return 'sidebar-create-new-active'
    if (folder.id || folder.name) {
      const folderId = folder.id || folder.name
      return `sidebar-folder-${folderId}-active`
    }
    return undefined
  }

  return (
    <FolderWrapper
      last={isLast}
      onLongPress={onLongPress}
      onPress={handlePress}
      testID={getTestID()}
      accessibilityLabel={getAccessibilityLabel()}
    >
      <FolderContainer>
        {folder.icon}

        <FolderContent>
          <FolderText>{folder.name}</FolderText>

          {!folder.isCreateNew && (
            <FolderCount testID={getCountTestID()}>
              {folder.count ?? 0} {t`items`}
            </FolderCount>
          )}
        </FolderContent>

        {isActive && (
          <CheckIcon
            testID={getActiveCheckTestID()}
            color={colors.primary400.mode1}
            size="24"
          />
        )}
      </FolderContainer>

      <KebabMenuIcon size="21" />
    </FolderWrapper>
  )
}
