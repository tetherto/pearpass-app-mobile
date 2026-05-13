import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme, rawTokens, Text, Button } from '@tetherto/pearpass-lib-ui-kit'
import { ArrowBackOutined } from '@tetherto/pearpass-lib-ui-kit/icons'

import { ScreenHeader } from './index'

type BackScreenHeaderProps = {
  title?: string
  onBack: () => void
  centerSlot?: ReactNode
  rightActions?: ReactNode
  style?: StyleProp<ViewStyle>
}

export const BackScreenHeader = ({
  title,
  onBack,
  centerSlot,
  rightActions,
  style
}: BackScreenHeaderProps) => {
  const { theme } = useTheme()

  return (
    <ScreenHeader
      style={style}
      contentStyle={{ gap: rawTokens.spacing6 }}
      leftSlot={
        <Button
          variant="tertiary"
          size="medium"
          aria-label="Go back"
          iconBefore={
            <ArrowBackOutined
              color={theme.colors.colorTextPrimary}
            />
          }
          onClick={onBack}
        />
      }
      centerSlot={
        centerSlot || (
          <Text variant="bodyEmphasized">
            {title}
          </Text>
        )
      }
      rightActions={rightActions}
    />
  )
}
