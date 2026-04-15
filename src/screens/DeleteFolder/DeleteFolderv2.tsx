import { useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import type { NavigationProp } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useFolders } from '@tetherto/pearpass-lib-vault'
import { UNSUPPORTED } from '@tetherto/pearpass-lib-constants'

import { Button, Radio } from '@tetherto/pearpass-lib-ui-kit'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { useSharedFilter } from 'src/context/SharedFilterContext'
import { Layout } from 'src/containers/Layout'
import { styles } from './DeleteFolderv2Styles'

export const DeleteFolderV2 = ({ route }) => {
  const { folderName } = route.params ?? {}

  const [selected, setSelected] = useState('deleteFolderAndItems')

  const { t } = useLingui()
  const { deleteFolder } = useFolders()
  const navigation = useNavigation<NavigationProp<Record<string, undefined>>>()
  const { state, setState } = useSharedFilter()

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
              'Only the folder will be removed. Your items will be moved to the All Folder list.'
          }
        ]
      : []),
    {
      value: 'deleteFolderAndItems',
      label: 'Delete folder and items',
      description:
        'This will permanently remove the folder and all 12 items inside. This action cannot be undone.'
    }
  ]

  const isDeleteFolderOnlySelected = UNSUPPORTED && selected === 'deleteFolder'

  const handleDelete = () => {
    deleteFolder(folderName)

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
          <Button onClick={handleDelete}>
            {t`Delete Folder`}
          </Button>
        ) : (
          <Button variant="destructive" onClick={handleDelete}>
            {t`Delete folders and items`}
          </Button>
        )
      }
    >
      <Radio options={defaultOptions} value={selected} onChange={setSelected} />
    </Layout>
  )
}
