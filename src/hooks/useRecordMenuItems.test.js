import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { renderHook } from '@testing-library/react-native'
import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'

import { useRecordMenuItems } from './useRecordMenuItems'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (text) => text
  })
}))
jest.mock('@tetherto/pearpass-lib-vault', () => ({
  RECORD_TYPES: {
    LOGIN: 'LOGIN',
    CREDIT_CARD: 'CREDIT_CARD',
    IDENTITY: 'IDENTITY',
    NOTE: 'NOTE',
    CUSTOM: 'CUSTOM',
    WIFI_PASSWORD: 'WIFI_PASSWORD',
    PASS_PHRASE: 'PASS_PHRASE'
  }
}))

let mockIsV2 = false
jest.mock('../utils/designVersion', () => ({
  isV2: () => mockIsV2
}))

const renderHookWithProviders = (hook) =>
  renderHook(hook, {
    wrapper: ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    )
  })

describe('useRecordMenuItems', () => {
  describe('v1', () => {
    beforeEach(() => {
      mockIsV2 = false
    })

    test('returns all items in v1 order', () => {
      const { result } = renderHookWithProviders(() => useRecordMenuItems())

      expect(result.current).toHaveLength(9)
      expect(result.current.map((item) => item.type)).toEqual([
        'all',
        RECORD_TYPES.LOGIN,
        RECORD_TYPES.CREDIT_CARD,
        RECORD_TYPES.WIFI_PASSWORD,
        RECORD_TYPES.PASS_PHRASE,
        RECORD_TYPES.IDENTITY,
        RECORD_TYPES.NOTE,
        RECORD_TYPES.CUSTOM,
        'password'
      ])
    })
  })

  describe('v2', () => {
    beforeEach(() => {
      mockIsV2 = true
    })

    test('returns all items in v2 order', () => {
      const { result } = renderHookWithProviders(() => useRecordMenuItems())

      expect(result.current).toHaveLength(9)
      expect(result.current.map((item) => item.type)).toEqual([
        'all',
        RECORD_TYPES.LOGIN,
        RECORD_TYPES.CREDIT_CARD,
        RECORD_TYPES.IDENTITY,
        RECORD_TYPES.NOTE,
        RECORD_TYPES.PASS_PHRASE,
        RECORD_TYPES.WIFI_PASSWORD,
        RECORD_TYPES.CUSTOM,
        'password'
      ])
    })

    test('v2 items include icon property', () => {
      const { result } = renderHookWithProviders(() => useRecordMenuItems())

      result.current.forEach((item) => {
        expect(item).toHaveProperty('icon')
      })
    })
  })

  test('each item has name and type properties', () => {
    const { result } = renderHookWithProviders(() => useRecordMenuItems())

    result.current.forEach((item) => {
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('type')
    })
  })

  test('excludes specified items', () => {
    const excludeTypes = [RECORD_TYPES.LOGIN, 'password']

    const { result } = renderHookWithProviders(() =>
      useRecordMenuItems({ exclude: excludeTypes })
    )

    expect(result.current.map((item) => item.type)).not.toContain(
      RECORD_TYPES.LOGIN
    )
    expect(result.current.map((item) => item.type)).not.toContain('password')
    expect(result.current).toHaveLength(7)
  })

  test('handles empty exclude array', () => {
    const { result } = renderHookWithProviders(() =>
      useRecordMenuItems({ exclude: [] })
    )

    expect(result.current).toHaveLength(9)
  })

  test('handles undefined exclude', () => {
    const { result } = renderHookWithProviders(() => useRecordMenuItems({}))

    expect(result.current).toHaveLength(9)
  })
})
