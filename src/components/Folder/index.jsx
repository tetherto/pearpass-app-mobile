import { useLingui } from '@lingui/react/macro'
import {
  CheckIcon,
  KebabMenuIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View } from 'react-native'

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

      onCreateNewFolder()

      return
    }

    onFolderSelect(folder)
  }

  const getTestID = () => {
    if (folder.id === 'allFolder') return 'sidebar-all-folders'
    if (folder.id === 'favorite') return 'sidebar-favorites'
    if (folder.isCreateNew) return 'sidebar-create-new'
    return undefined
  }

    if (folder.isCreateNew) {
  const getCountTestID = () => {
    if (folder.id === 'allFolder') return 'sidebar-all-folders-count'
    if (folder.id === 'favorite') return 'sidebar-favorites-count'
    return undefined
  }

  return (
    <FolderWrapper
      last={isLast}
      onLongPress={onLongPress}
      onPress={handlePress}
      testID={getTestID()}
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
