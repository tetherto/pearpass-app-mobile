import { useLingui } from '@lingui/react/macro'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { XIcon } from '@tetherto/pearpass-lib-ui-react-native-components'

import {
  Actions,
  CloseButtonWrapper,
  Container,
  Description,
  Header,
  Title
} from './styles'
import { useModal } from '../../../context/ModalContext'
import {
  ButtonLittle,
  ButtonPrimary,
  InputPasswordPearPass
} from '../../../libComponents'

export const VaultPasswordFormModalContent = ({ vault, onSubmit }) => {
  const { t } = useLingui()

  const { closeModal } = useModal()

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors } = useForm({
    initialValues: {
      password: ''
    },
    validate: (values) => schema.validate(values)
  })

  const submit = async (values) => {
    if (!vault?.id) {
      return
    }

    try {
      await onSubmit?.(values.password)
    } catch (error) {
      setErrors({
        password: typeof error === 'string' ? error : t`Invalid password`
      })
    }
  }

  return (
    <Container>
      <Header>
        <Title>{t`Insert Vault’s password`}</Title>
        <Description>{t`Unlock with the ${vault?.name ?? vault?.id} Vault password`}</Description>
      </Header>
      <Actions>
        <InputPasswordPearPass
          placeholder={t`Enter Vault password`}
          isPassword
          {...register('password')}
        />
        <ButtonPrimary
          onPress={handleSubmit(submit)}
          stretch
        >{t`Submit`}</ButtonPrimary>
      </Actions>
      <CloseButtonWrapper>
        <ButtonLittle
          variant="secondary"
          borderRadius="md"
          startIcon={XIcon}
          onPress={closeModal}
        />
      </CloseButtonWrapper>
    </Container>
  )
}
