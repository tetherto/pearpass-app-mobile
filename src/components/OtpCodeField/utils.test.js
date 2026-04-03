import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { getTimerColor, TIMER_ANIMATION_DURATION } from './utils'

describe('getTimerColor', () => {
  it('should return errorRed when expiring is true', () => {
    expect(getTimerColor(true)).toBe(colors.errorRed.mode1)
  })

  it('should return primary400 when expiring is false', () => {
    expect(getTimerColor(false)).toBe(colors.primary400.mode1)
  })
})

describe('TIMER_ANIMATION_DURATION', () => {
  it('should be 1000ms', () => {
    expect(TIMER_ANIMATION_DURATION).toBe(1000)
  })
})
