import { colors } from 'src/utils/colors'

export const TIMER_ANIMATION_DURATION = 1000

export const getTimerColor = (expiring: boolean): string =>
  expiring ? colors.errorRed.mode1 : colors.primary400.mode1
