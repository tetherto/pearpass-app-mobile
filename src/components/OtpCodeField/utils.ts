import { colors } from 'pearpass-lib-ui-theme-provider/native'

export const TIMER_ANIMATION_DURATION = 1000

export const getTimerColor = (expiring: boolean): string =>
  expiring ? colors.errorRed.mode1 : colors.primary400.mode1
