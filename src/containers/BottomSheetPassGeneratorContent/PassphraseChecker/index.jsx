import { useLingui } from '@lingui/react/macro'
import { checkPassphraseStrength } from '@tetherto/pearpass-utils-password-check'

import { HighlightString, NoticeText } from '../../../libComponents'
import { PasswordWrapper } from '../styles'

/**
 * @param {{
 *  pass: Array<string>
 * }} props
 */
export const PassphraseChecker = ({ pass }) => {
  const { t } = useLingui()

  const { strengthText, strengthType } = checkPassphraseStrength(pass)

  return (
    <PasswordWrapper>
      <HighlightString text={pass && pass.join('-')} />
      <NoticeText text={t(strengthText)} type={strengthType} />
    </PasswordWrapper>
  )
}
