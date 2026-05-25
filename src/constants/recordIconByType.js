import {
  Note,
  CreditCard,
  AccountCircleOutlined,
  Key,
  LockOutlined,
  WiFi,
  FormatQuote
} from '@tetherto/pearpass-lib-ui-kit/icons'

/**
 * @type {Record<string, import('react').ElementType>}
 */
export const RECORD_ICON_BY_TYPE = {
  all: Key,
  login: AccountCircleOutlined,
  identity: AccountCircleOutlined,
  creditCard: CreditCard,
  note: Note,
  custom: LockOutlined,
  password: LockOutlined,
  wifiPassword: WiFi,
  passPhrase: FormatQuote
}
