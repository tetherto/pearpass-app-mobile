import { useLingui } from '@lingui/react/macro'
import { Button } from '@tetherto/pearpass-lib-ui-kit'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { ActivityIndicator } from 'react-native'

import {
  Container,
  ContentContainer,
  Header,
  ModalActions,
  Title
} from './styles'

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
            <Button
              variant="primary"
              size="medium"
              fullWidth
              onClick={primaryAction}
            >
              {t`Save`}
            </Button>

            <Button
              variant="secondary"
              size="medium"
              fullWidth
              onClick={secondaryAction}
            >
              {t`Cancel`}
            </Button>
          </>
        )}
      </ModalActions>
    </Container>
  )
}
