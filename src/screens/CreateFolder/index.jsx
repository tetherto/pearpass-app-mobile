import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import { FolderIcon } from 'pearpass-lib-ui-react-native-components'
import { XIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useCreateFolder, useFolders } from 'pearpass-lib-vault'
import Toast from 'react-native-toast-message'

import {
  Container,
  FolderFormHeader,
  FolderFormHeaderActions,
  FolderFormHeaderGoBack,
  FormWrapper
} from './styles'
import { FormGroup } from '../../components/FormGroup'
import { ButtonLittle, InputField } from '../../libComponents'

export const CreateFolder = ({ route }) => {
  const { onGoBack, initialValues } = route.params ?? {}

  const { t } = useLingui()
  const navigation = useNavigation()

  const { renameFolder } = useFolders()

  const { createFolder } = useCreateFolder({
    onCompleted: (folder) => {
      navigation.goBack()

      if (onGoBack) {
        onGoBack(folder)
      }
    },
    onError: (error) => {
      if (error === 'folder_name_exists') {
        Toast.show({
          type: 'baseToast',
          text1: t`ERROR: Folder with this name already exists`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    }
  })

  const schema = Validator.object({
    title: Validator.string().required(t`Title is required`)
  })

  const { register, handleSubmit } = useForm({
    initialValues: {
      title: initialValues?.title ?? ''
    },
    validate: (values) => schema.validate(values)
  })

  const onSubmit = (values) => {
    if (initialValues) {
      renameFolder(initialValues.title, values.title)
      navigation.goBack()
    } else {
      createFolder(values.title)
    }
  }

  return (
    <Container testID="create-folder-screen" accessibilityLabel="create-folder-screen">
      <FolderFormHeader>
        <FolderFormHeaderGoBack
          activeOpacity={0.5}
          onPress={() =>
            onGoBack
              ? navigation.goBack()
              : navigation.navigate('MainTabNavigator')
          }
          testID="create-folder-close-button"
          accessibilityLabel="create-folder-close-button"
        >
          <XIcon size="21" color={colors.primary400.mode1} />
        </FolderFormHeaderGoBack>

        <FolderFormHeaderActions>
          <ButtonLittle
            startIcon={FolderIcon}
            activeOpacity={0.5}
            onPress={handleSubmit(onSubmit)}
            testID={initialValues?.title ? "create-folder-save-button" : "create-folder-create-button"}
            accessibilityLabel={initialValues?.title ? "create-folder-save-button" : "create-folder-create-button"}
          >
            {initialValues?.title ? t`Save` : t`Create new folder`}
          </ButtonLittle>
        </FolderFormHeaderActions>
      </FolderFormHeader>

      <FormWrapper>
        <FormGroup>
          <InputField
            label={t`Title`}
            placeholder={t`No title`}
            variant="outline"
            testID="create-folder-title-input"
            accessibilityLabel="create-folder-title-input"
            {...register('title')}
          />
        </FormGroup>
      </FormWrapper>
    </Container>
  )
}
