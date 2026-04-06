import { getPasswordStrengthMeta } from './passwordPolicy'

export const getVaultPasswordStrengthMeta = (password, errors = {}) => {
  const meta = getPasswordStrengthMeta(password, errors)

  return {
    result: meta.result,
    progress: meta.progress,
    color: meta.color,
    tone: meta.tone
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
