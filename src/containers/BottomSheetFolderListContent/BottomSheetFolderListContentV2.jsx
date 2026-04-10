import { useMemo } from 'react'

import {
  BottomSheetScrollView,
  useBottomSheetModal
} from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { AUTHENTICATOR_ENABLED } from '@tetherto/pearpass-lib-constants'
import { ContextMenu, Text, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  CheckIcon,
  FolderIcon,
  LockIcon,
  PlusIcon,
  StarIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { useFolders, useRecordCountsByType } from '@tetherto/pearpass-lib-vault'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { LogoLock } from '../../svgs/LogoLock'

const ROW_ICON_SIZE = 24

export const BottomSheetFolderListContentV2 = ({
  trigger,
  selectedFolder,
  onFolderSelect,
  isFilter = false,
  testID = undefined
}) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { bottom } = useSafeAreaInsets()
  const { dismiss } = useBottomSheetModal()
  const { data: recordCountsByType } = useRecordCountsByType({})
  const { data: folders } = useFolders()

  const folderItems = useMemo(() => {
    const customFolders =
      Object.values(folders?.customFolders ?? {}).map((folder) => ({
        name: folder.name,
        count: folder.records.filter((record) => !!record.data).length,
        icon: (
          <FolderIcon size={ROW_ICON_SIZE} color={theme.colors.colorPrimary} />
        )
      })) ?? []

    const createNewItem = {
      name: t`Create new`,
      icon: <PlusIcon size={ROW_ICON_SIZE} color={theme.colors.colorPrimary} />,
      isCreateNew: true
    }

    if (!isFilter) {
      return [...customFolders, createNewItem]
    }

    return [
      {
        name: t`All Items`,
        id: 'allFolder',
        count: recordCountsByType?.all,
        icon: <LogoLock width={24} height={32} />
      },
      {
        name: t`Favorites`,
        id: 'favorite',
        count: folders?.favorites?.records.length || 0,
        icon: <StarIcon size={ROW_ICON_SIZE} />
      },
      ...customFolders,
      ...(AUTHENTICATOR_ENABLED
        ? [
            {
              name: t`Authenticator`,
              id: 'authenticator',
              icon: (
                <LockIcon
                  size={ROW_ICON_SIZE}
                  color={theme.colors.colorPrimary}
                />
              ),
              isAuthenticator: true
            }
          ]
        : []),
      createNewItem
    ]
  }, [folders, isFilter, recordCountsByType, t, theme.colors.colorPrimary])

  const handleCreateNewFolder = () => {
    dismiss()

    if (isFilter) {
      navigation.navigate('CreateFolder')
      return
    }

    navigation.navigate('CreateFolder', {
      onGoBack: ({ folder }) => onFolderSelect?.({ name: folder })
    })
  }

  const handleFolderPress = (folder) => {
    if (folder.isCreateNew) {
      handleCreateNewFolder()
      return
    }

    dismiss()
    onFolderSelect?.(folder)
  }

  return (
    <ContextMenu trigger={trigger} testID={testID}>
      <BottomSheetScrollView
        style={[
          styles.sheetContent,
          { backgroundColor: theme.colors.colorSurfacePrimary }
        ]}
        contentContainerStyle={{ paddingBottom: bottom + 12 }}
      >
        <View style={styles.list}>
          {folderItems.map((folder, index) => {
            const isActive =
              !!selectedFolder &&
              (selectedFolder === folder.name || selectedFolder === folder.id)
            const showCount = !folder.isCreateNew && !folder.isAuthenticator

            return (
              <TouchableOpacity
                key={folder.id || folder.name}
                activeOpacity={0.8}
                onPress={() => handleFolderPress(folder)}
                style={[
                  styles.row,
                  index < folderItems.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.colorBorderPrimary
                  }
                ]}
              >
                <View style={styles.rowMain}>
                  <View style={styles.icon}>{folder.icon}</View>

                  <View style={styles.copy}>
                    <Text variant="bodyEmphasized" numberOfLines={1}>
                      {folder.name}
                    </Text>

                    {showCount && (
                      <Text
                        variant="body"
                        color={theme.colors.colorTextSecondary}
                      >
                        {folder.count ?? 0} {t`items`}
                      </Text>
                    )}
                  </View>
                </View>

                {isActive && (
                  <CheckIcon size="20" color={theme.colors.colorPrimary} />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </BottomSheetScrollView>
    </ContextMenu>
  )
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingTop: 8
  },
  list: {
    overflow: 'hidden'
  },
  row: {
    minHeight: 84,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16
  },
  icon: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copy: {
    flex: 1,
    gap: 2
  }
})
