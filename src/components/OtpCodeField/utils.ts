import { DefaultTheme } from 'styled-components/native'

export const TIMER_ANIMATION_DURATION = 1000

export const getTimerColor = (
  theme: DefaultTheme,
  expiring: boolean
): string =>
  expiring ? theme.colors.errorRed.mode1 : theme.colors.primary400.mode1
