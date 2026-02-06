import { useLingui } from '@lingui/react/macro'

import { Container, Title } from './styles'

export const EmptyResultsView = () => {
  const { t } = useLingui()

  return (
    <Container>
      <Title>{t`No result found.`}</Title>
    </Container>
  )
}
