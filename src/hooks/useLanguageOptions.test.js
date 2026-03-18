import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { renderHook } from '@testing-library/react-native'

import { useLanguageOptions } from './useLanguageOptions'
import messages from '../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (text) => text
  })
}))

jest.mock('@tetherto/pearpass-lib-constants', () => ({
  LANGUAGES: [
    { value: 'en' },
    { value: 'it' },
    { value: 'es' },
    { value: 'fr' }
  ]
}))

describe('useLanguageOptions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return language options with correct labels and values', () => {
    const wrapper = ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    )
    const { result } = renderHook(() => useLanguageOptions(), { wrapper })

    expect(result.current.languageOptions).toEqual([
      { label: 'English', value: 'en' },
      { label: 'Italian', value: 'it' },
      { label: 'Spanish', value: 'es' },
      { label: 'French', value: 'fr' }
    ])
  })

  it('should memoize the language options', () => {
    const wrapper = ({ children }) => (
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    )
    const { result, rerender } = renderHook(() => useLanguageOptions(), {
      wrapper
    })
    const firstResult = result.current.languageOptions

    rerender()

    expect(result.current.languageOptions).toBe(firstResult)
  })
})
