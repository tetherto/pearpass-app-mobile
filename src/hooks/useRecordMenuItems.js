import { useMemo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { MOBILE_DESIGN_VERSION } from '@tetherto/pearpass-lib-constants'
import {
  Layers,
  AccountCircleOutlined,
  CreditCard,
  AssignmentInd,
  FormatQuote,
  GridView,
  LockOutlined,
  Note,
  WiFi
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { RECORD_TYPES } from '@tetherto/pearpass-lib-vault'

/**
 * @param {{
 *    exclude?: Array<string>
 * }} param0
 * @returns {{
 *    name: string
 *   type: string
 *  description?: string
 * }[]}
 */
export const useRecordMenuItems = ({ exclude } = {}) => {
  const { t } = useLingui()

  const defaultItems = useMemo(
    () =>
      [
        {
          name: t`All`,
          type: 'all'
        },
        {
          name: t`Logins`,
          type: RECORD_TYPES.LOGIN,
          description: t`Save your username and password for any website or app.`
        },
        {
          name: t`Credit cards`,
          type: RECORD_TYPES.CREDIT_CARD,
          description: t`Securely store card number, expiry date, and CVV.`
        },
        {
          name: t`Wi-Fi`,
          type: RECORD_TYPES.WIFI_PASSWORD,
          description: t`Keep your Wi-Fi name and password safe.`
        },
        {
          name: t`Recovery phrase`,
          type: RECORD_TYPES.PASS_PHRASE,
          description: t`Securely store app recovery phrases.`
        },
        {
          name: t`Identities`,
          type: RECORD_TYPES.IDENTITY,
          description: t`Keep personal info like ID numbers and addresses safe.`
        },
        {
          name: t`Notes`,
          type: RECORD_TYPES.NOTE,
          description: t`Encrypt and store private notes or sensitive text.`
        },
        {
          name: t`Custom`,
          type: RECORD_TYPES.CUSTOM,
          description: t`Create your own entry with fully custom fields. `
        },
        {
          name: t`Password`,
          type: 'password',
          description: t`Create a safe password or passphrase`
        }
      ].filter((item) => !exclude?.includes(item.type)),
    [t, exclude]
  )

  const defaultV2Items = useMemo(
    () =>
      [
        {
          name: t`All Items`,
          type: 'all',
          icon: Layers
        },
        {
          name: t`Logins`,
          type: RECORD_TYPES.LOGIN,
          description: t`Save your username and password for any website or app.`,
          icon: AccountCircleOutlined
        },
        {
          name: t`Credit Cards`,
          type: RECORD_TYPES.CREDIT_CARD,
          description: t`Securely store card number, expiry date, and CVV.`,
          icon: CreditCard
        },
        {
          name: t`Identities`,
          type: RECORD_TYPES.IDENTITY,
          description: t`Keep personal info like ID numbers and addresses safe.`,
          icon: AssignmentInd
        },
        {
          name: t`Notes`,
          type: RECORD_TYPES.NOTE,
          description: t`Encrypt and store private notes or sensitive text.`,
          icon: Note
        },
        {
          name: t`Recovery Phrases`,
          type: RECORD_TYPES.PASS_PHRASE,
          description: t`Securely store app recovery phrases.`,
          icon: FormatQuote
        },
        {
          name: t`Wi-Fi`,
          type: RECORD_TYPES.WIFI_PASSWORD,
          description: t`Keep your Wi-Fi name and password safe.`,
          icon: WiFi
        },
        {
          name: t`Other`,
          type: RECORD_TYPES.CUSTOM,
          description: t`Create your own entry with fully custom fields.`,
          icon: GridView
        },
        {
          name: t`Password`,
          type: 'password',
          description: t`Create a safe password or passphrase`,
          icon: LockOutlined
        }
      ].filter((item) => !exclude?.includes(item.type)),
    [t, exclude]
  )

  return MOBILE_DESIGN_VERSION === 2 ? defaultV2Items : defaultItems
}
