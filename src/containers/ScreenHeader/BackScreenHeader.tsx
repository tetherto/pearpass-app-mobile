import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme, rawTokens, Text, Button } from '@tetherto/pearpass-lib-ui-kit'
import { ArrowBackOutined } from '@tetherto/pearpass-lib-ui-kit/icons'

import { ScreenHeader } from './index'

type BackScreenHeaderProps = {
  title: string
  onBack: () => void
  rightActions?: ReactNode
  style?: StyleProp<ViewStyle>
}

export const BackScreenHeader = ({ title, onBack, rightActions, style }: BackScreenHeaderProps) => {
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
        <Text variant="bodyEmphasized">
          {title}
        </Text>
      }
      rightActions={rightActions}
    />
  )
}
