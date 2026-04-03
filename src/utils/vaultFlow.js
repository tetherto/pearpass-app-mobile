import { checkPasswordStrength } from '@tetherto/pearpass-utils-password-check'

const PASSWORD_STRENGTH_META = {
  vulnerable: {
    progress: 0.33,
    color: '#F87171',
    tone: 'critical'
  },
  weak: {
    progress: 0.66,
    color: '#FBBF24',
    tone: 'warning'
  },
  safe: {
    progress: 1,
    color: '#A3E635',
    tone: 'success'
  }
}

export const getVaultPasswordStrengthMeta = (password, errors = {}) => {
  if (!password?.length) {
    return {
      result: null,
      progress: 0,
      color: '#2B3320',
      tone: 'idle'
    }
  }

  const result = checkPasswordStrength(password, { errors })
  const strengthMeta =
    PASSWORD_STRENGTH_META[result.type] || PASSWORD_STRENGTH_META.vulnerable

  return {
    result,
    progress: strengthMeta.progress,
    color: strengthMeta.color,
    tone: strengthMeta.tone
  }
}

export const getVaultScreenState = ({
  isSubmitting = false,
  hasValue = false,
  hasError = false,
  isValid = false,
  isTouched = false
} = {}) => {
  if (isSubmitting) {
    return 'submitting'
  }

  if (hasError) {
    return 'error'
  }

  if (isValid && isTouched) {
    return 'success'
  }

  if (hasValue || isTouched) {
    return 'typing'
  }

  return 'idle'
}

export const buildVaultAccessEntries = ({ devices = [] } = {}) => [
  {
    id: 'owner',
    kind: 'owner',
    name: 'You',
    role: 'admin',
    status: 'active',
    removable: false
  },
  ...devices.map((device, index) => ({
    id: `${device?.name || 'device'}-${index}`,
    kind: 'device',
    name: device?.name || `Device ${index + 1}`,
    createdAt: device?.createdAt,
    role: 'viewer',
    status: 'active',
    removable: true
  }))
]
