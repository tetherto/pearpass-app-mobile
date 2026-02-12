import { useLingui } from '@lingui/react/macro'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { ActivityIndicator } from 'react-native'

import {
  Container,
  ContentContainer,
  Header,
  ModalActions,
  Title
} from './styles'
import { ButtonPrimary, ButtonSecondary } from '../../../libComponents'

/**
 * @param {{
 *    children: React.ReactNode
 *    title: string
 *    isLoading: boolean
 *    primaryAction: () => void
 *    secondaryAction: () => void
 * }} props
 */
export const ModifyVaultsModaContentWrapper = ({
  children,
  title,
  isLoading,
  primaryAction,
  secondaryAction
}) => {
  const { t } = useLingui()

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
      </Header>

      <ContentContainer>{children}</ContentContainer>

      <ModalActions>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary400.mode1} />
        ) : (
          <>
            <ButtonPrimary onPress={primaryAction} size="sm">
              {t`Save`}
            </ButtonPrimary>

            <ButtonSecondary onPress={secondaryAction} size="sm">
              {t`Cancel`}
            </ButtonSecondary>
          </>
        )}
      </ModalActions>
    </Container>
  )
}
