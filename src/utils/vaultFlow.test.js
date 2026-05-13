import { i18n } from '@lingui/core'

import { buildVaultAccessEntries, getVaultScreenState } from './vaultFlow'
import { messages } from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

describe('vaultFlow', () => {
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
      ],
      translate: (message) => i18n._(message)
    })

    expect(entries).toHaveLength(3)
    expect(entries[0]).toMatchObject({
      id: 'owner',
      kind: 'owner',
      name: 'You',
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
