import { checkPasswordStrength } from '@tetherto/pearpass-utils-password-check'

const PASSWORD_STRENGTH_META = {
  vulnerable: {
    progress: 0.33,
    color: '#F87171',
    tone: 'critical',
    indicator: 'vulnerable'
  },
  weak: {
    progress: 0.66,
    color: '#FBBF24',
    tone: 'warning',
    indicator: 'decent'
  },
  safe: {
    progress: 1,
    color: '#A3E635',
    tone: 'success',
    indicator: 'strong'
  }
}

export const PASSWORD_VALIDATION_MESSAGES = {
  minLength: 'Password must be at least 8 characters long',
  hasLowerCase: 'Password must contain at least one lowercase letter',
  hasUpperCase: 'Password must contain at least one uppercase letter',
  hasNumbers: 'Password must contain at least one number',
  hasSymbols: 'Password must contain at least one special character'
}

export const getPasswordValidationMessages = (translate) => ({
  minLength:
    translate?.(PASSWORD_VALIDATION_MESSAGES.minLength) ||
    PASSWORD_VALIDATION_MESSAGES.minLength,
  hasLowerCase:
    translate?.(PASSWORD_VALIDATION_MESSAGES.hasLowerCase) ||
    PASSWORD_VALIDATION_MESSAGES.hasLowerCase,
  hasUpperCase:
    translate?.(PASSWORD_VALIDATION_MESSAGES.hasUpperCase) ||
    PASSWORD_VALIDATION_MESSAGES.hasUpperCase,
  hasNumbers:
    translate?.(PASSWORD_VALIDATION_MESSAGES.hasNumbers) ||
    PASSWORD_VALIDATION_MESSAGES.hasNumbers,
  hasSymbols:
    translate?.(PASSWORD_VALIDATION_MESSAGES.hasSymbols) ||
    PASSWORD_VALIDATION_MESSAGES.hasSymbols
})

export const getPasswordStrengthMeta = (password, errors = {}) => {
  if (!password?.length) {
    return {
      result: null,
      progress: 0,
      color: '#2B3320',
      tone: 'idle',
      indicator: null
    }
  }

  const result = checkPasswordStrength(password, { errors })
  const strengthMeta =
    PASSWORD_STRENGTH_META[result.type] || PASSWORD_STRENGTH_META.vulnerable

  return {
    result,
    progress: strengthMeta.progress,
    color: strengthMeta.color,
    tone: strengthMeta.tone,
    indicator: strengthMeta.indicator
  }
}

export const getPasswordIndicatorVariant = (password, errors = {}) =>
  getPasswordStrengthMeta(password, errors).indicator

export const getPasswordsMatch = (password, confirmPassword) =>
  Boolean(
    password?.length && confirmPassword?.length && password === confirmPassword
  )
