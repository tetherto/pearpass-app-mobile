import { useLingui } from '@lingui/react/macro'
import type { NavigationProp } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { useCreateFolder, useFolders } from '@tetherto/pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import { Button, InputField } from '@tetherto/pearpass-lib-ui-kit'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { useSharedFilter } from 'src/context/SharedFilterContext'
import { Layout } from 'src/containers/Layout'
import { styles } from './CreateFolderV2Styles'

const FOLDER_NAME_EXISTS_ERROR = 'folder_name_exists'

export const CreateFolderV2 = ({ route }) => {
  const { onGoBack, initialValues } = route.params ?? {}

  const { t } = useLingui()
  const navigation = useNavigation<NavigationProp<Record<string, undefined>>>()
  const { renameFolder } = useFolders()
  const { state, setState } = useSharedFilter()

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
      return
    }

    navigation.navigate('MainTabNavigator')
  }

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`)
  })

  const { register, handleSubmit } = useForm({
    initialValues: {
      title: initialValues?.title ?? ''
    },
    validate: (values) => schema.validate(values)
  })

  const { onChange: onChangeTitleText, ...titleField } = register('title')
  const { createFolder } = useCreateFolder({
    onCompleted: (folder) => {
      navigation.goBack()

      if (onGoBack) {
        onGoBack(folder)
      }
    },
    onError: (error) => {
      if (error === FOLDER_NAME_EXISTS_ERROR) {
        Toast.show({
          type: 'baseToast',
          text1: t`ERROR: Folder with this name already exists`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    }
  })

  const onSubmit = (values) => {
    if (initialValues) {
      renameFolder(initialValues.title, values.title)

      if (state?.folder === initialValues.title) {
        setState((prev) => ({ ...prev, folder: values.title }))
      }

      navigation.goBack()
    } else {
      createFolder(values.title)
    }
  }

  return (
    <Layout
      scrollable
      contentStyle={styles.surfaceContent}
      header={
        <BackScreenHeader
          title={initialValues ? t`Rename Folder` : t`Create New Folder`}
          onBack={handleBack}
        />
      }
      footer={
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!titleField.value.trim()}
        >
          {initialValues ? t`Save` : t`Create New Folder`}
        </Button>
      }
    >
      <InputField
        label={t`Folder Name`}
        placeholder={t`Enter name`}
        testID="create-folder-title-input"
        onChangeText={onChangeTitleText}
        {...titleField}
      />
    </Layout>
  )
}
