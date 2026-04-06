import {
  getPasswordIndicatorVariant,
  getPasswordsMatch,
  getPasswordStrengthMeta
} from './passwordPolicy'

describe('passwordPolicy', () => {
  it('returns idle metadata when password is empty', () => {
    expect(getPasswordStrengthMeta('')).toEqual({
      result: null,
      progress: 0,
      color: '#2B3320',
      tone: 'idle',
      indicator: null
    })
  })

  it('returns strong indicator for a valid password', () => {
    expect(getPasswordIndicatorVariant('StrongVault#2026')).toBe('strong')
  })

  it('detects matching and non-matching passwords', () => {
    expect(getPasswordsMatch('Vault#2026', 'Vault#2026')).toBe(true)
    expect(getPasswordsMatch('Vault#2026', 'Vault#2027')).toBe(false)
    expect(getPasswordsMatch('Vault#2026', '')).toBe(false)
  })
})
