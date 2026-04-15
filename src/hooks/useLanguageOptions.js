import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { LANGUAGES } from '@tetherto/pearpass-lib-constants'

export const useLanguageOptions = () => {
  const { t } = useLingui()

  const languageOptions = useMemo(() => {
    const languageLabelByValue = {
      en: t`English`,
      it: t`Italian`,
      es: t`Spanish`,
      fr: t`French`
    }

    return LANGUAGES.map((lang) => ({
      label: languageLabelByValue[lang.value],
      value: lang.value
    }))
  }, [LANGUAGES, t])

  return {
    languageOptions
  }
}
