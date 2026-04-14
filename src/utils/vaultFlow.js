import { msg } from '@lingui/core/macro'

const OWNER_LABEL = msg`You`

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

export const buildVaultAccessEntries = ({ devices = [], translate } = {}) => [
  {
    id: 'owner',
    kind: 'owner',
    name: translate?.(OWNER_LABEL) || 'You',
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
