import { useLingui } from '@lingui/react/macro'
import type { NavigationProp } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useFolders } from '@tetherto/pearpass-lib-vault'

import { Button, Radio } from '@tetherto/pearpass-lib-ui-kit'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from 'src/containers/ScreenLayout'
import { styles } from './DeleteFolderv2Styles'
import { useState } from 'react'

export const DeleteFolderV2 = ({ route }) => {
  const { onGoBack, folderName } = route.params ?? {}

  const [selected, setSelected] = useState('deleteFolderAndItems')

  const { t } = useLingui()
  const { deleteFolder } = useFolders()
  const navigation = useNavigation<NavigationProp<Record<string, undefined>>>()

  const defaultOptions = [
    {
      value: 'deleteFolder',
      label: 'Delete Folder',
      description:
        'Only the folder will be removed. Your items will be moved to the All Folder list.'
    },
    {
      value: 'deleteFolderAndItems',
      label: 'Delete folder and items',
      description:
        'This will permanently remove the folder and all 12 items inside. This action cannot be undone.'
    }
  ]

  return (
    <ScreenLayout
      scrollable
      contentStyle={styles.surfaceContent}
      header={
        <BackScreenHeader
          title={t`Delete Folder`}
          onBack={() => {
            onGoBack
              ? navigation.goBack()
              : navigation.navigate('MainTabNavigator')
          }}
        />
      }
      footer={
        selected === 'deleteFolder' ? (
          <Button
            onClick={() => {
              deleteFolder(folderName)
              navigation.goBack()
            }}
          >
            {t`Delete Folder`}
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={() => {
              deleteFolder(folderName)
              navigation.goBack()
            }}
          >
            {t`Delete folders and items`}
          </Button>
        )
      }
    >
      <Radio options={defaultOptions} value={selected} onChange={setSelected} />
    </ScreenLayout>
  )
}
