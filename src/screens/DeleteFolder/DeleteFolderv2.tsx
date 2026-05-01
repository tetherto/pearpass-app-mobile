import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import type { NavigationProp } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useFolders, useRecords } from '@tetherto/pearpass-lib-vault'
import { UNSUPPORTED } from '@tetherto/pearpass-lib-constants'
import { View } from 'react-native'

import {
  Button,
  Radio,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { useSharedFilter } from 'src/context/SharedFilterContext'
import { Layout } from 'src/containers/Layout'
import { styles } from './DeleteFolderv2Styles'

export const DeleteFolderV2 = ({ route }) => {
  const { folderName } = route.params ?? {}

  const { t } = useLingui()
  const { theme } = useTheme()
  const { data: folders, deleteFolder } = useFolders()
  const { updateRecords, deleteRecords } = useRecords({ shouldSkip: true })
  const navigation = useNavigation<NavigationProp<Record<string, undefined>>>()
  const { state, setState } = useSharedFilter()

  const itemCount =
    folders?.customFolders?.[folderName]?.records?.filter(
      (record) => record.data
    ).length ?? 0

  const [selected, setSelected] = useState(
    itemCount > 0 ? 'deleteFolderAndItems' : 'deleteFolder'
  )

  const summaryText =
    itemCount === 1
      ? t`"${folderName}" folder contains ${itemCount} item.`
      : t`"${folderName}" folder contains ${itemCount} items.`

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
      return
    }

    navigation.navigate('MainTabNavigator')
  }

  const defaultOptions = [
    ...(!UNSUPPORTED
      ? [
          {
            value: 'deleteFolder',
            label: 'Delete Folder',
            description:
              'Only the folder will be removed.\nYour items will be moved to the All Folder list.'
          }
        ]
      : []),
    ...(itemCount > 0
      ? [
          {
            value: 'deleteFolderAndItems',
            label: 'Delete folder and items',
            description:
              itemCount === 1
                ? `This will permanently remove the folder and all ${itemCount} item inside.\nThis action cannot be undone.`
                : `This will permanently remove the folder and all ${itemCount} items inside.\nThis action cannot be undone.`
          }
        ]
      : [])
  ]

  const isDeleteFolderOnlySelected = selected === 'deleteFolder'

  const handleDelete = async () => {
    if (isDeleteFolderOnlySelected) {
      const recordsInFolder =
        folders?.customFolders?.[folderName]?.records ?? []

      const itemsToMove = recordsInFolder.filter((record) => record.data)
      const folderMarkerIds = recordsInFolder
        .filter((record) => !record.data)
        .map((record) => record.id)

      if (itemsToMove.length) {
        await updateRecords(
          itemsToMove.map((record) => ({ ...record, folder: null }))
        )
      }

      if (folderMarkerIds.length) {
        await deleteRecords(folderMarkerIds)
      }
    } else {
      await deleteFolder(folderName)
    }

    if (state?.folder === folderName) {
      setState((prev) => ({ ...prev, folder: 'allFolder', isFavorite: false }))
    }

    navigation.goBack()
  }

  return (
    <Layout
      scrollable
      contentStyle={styles.surfaceContent}
      header={<BackScreenHeader title={t`Delete Folder`} onBack={handleBack} />}
      footer={
        isDeleteFolderOnlySelected ? (
          <Button onClick={handleDelete}>{t`Delete Folder`}</Button>
        ) : (
          <Button variant="destructive" onClick={handleDelete}>
            {t`Delete folders and items`}
          </Button>
        )
      }
    >
      <View style={{ marginBottom: rawTokens.spacing12 }}>
        <Text variant="caption" color={theme.colors.colorTextSecondary}>
          {summaryText}
        </Text>
      </View>
      <Radio options={defaultOptions} value={selected} onChange={setSelected} />
    </Layout>
  )
}
