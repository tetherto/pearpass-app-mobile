import { i18n } from '@lingui/core'

import {
  PASSWORD_VALIDATION_MESSAGES,
  getPasswordValidationMessages,
  getPasswordIndicatorVariant,
  getPasswordsMatch,
  getPasswordStrengthMeta
} from './passwordPolicy'
import { messages } from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

describe('passwordPolicy', () => {
  it('returns extraction-safe validation messages with fallback strings', () => {
    expect(getPasswordValidationMessages()).toEqual(
      PASSWORD_VALIDATION_MESSAGES
    )
    expect(getPasswordValidationMessages((message) => i18n._(message))).toEqual(
      PASSWORD_VALIDATION_MESSAGES
    )
  })

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
