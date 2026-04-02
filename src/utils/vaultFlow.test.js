import {
  buildVaultAccessEntries,
  getVaultPasswordStrengthMeta,
  getVaultScreenState
} from './vaultFlow'

describe('vaultFlow', () => {
  it('returns idle password strength metadata when password is empty', () => {
    expect(getVaultPasswordStrengthMeta('')).toEqual({
      result: null,
      progress: 0,
      color: '#2B3320',
      tone: 'idle'
    })
  })

  it('returns success metadata for a strong password', () => {
    const meta = getVaultPasswordStrengthMeta('StrongVault#2026')

    expect(meta.result?.success).toBe(true)
    expect(meta.progress).toBe(1)
    expect(meta.tone).toBe('success')
  })

  it('derives screen state from validation state', () => {
    expect(
      getVaultScreenState({
        hasValue: true,
        isTouched: true
      })
    ).toBe('typing')

    expect(
      getVaultScreenState({
        hasValue: true,
        hasError: true,
        isTouched: true
      })
    ).toBe('error')

    expect(
      getVaultScreenState({
        hasValue: true,
        isValid: true,
        isTouched: true
      })
    ).toBe('success')
  })

  it('builds access entries from linked devices', () => {
    const entries = buildVaultAccessEntries({
      devices: [
        { name: 'iOS 18', createdAt: 111 },
        { name: 'Android 15', createdAt: 222 }
      ]
    })

    expect(entries).toHaveLength(3)
    expect(entries[0]).toMatchObject({
      id: 'owner',
      kind: 'owner',
      role: 'admin',
      removable: false
    })
    expect(entries[1]).toMatchObject({
      id: 'iOS 18-0',
      kind: 'device',
      role: 'viewer',
      removable: true
    })
  })
})
