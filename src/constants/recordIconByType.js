import {
  NoteIcon,
  CreditCardIcon,
  FullBodyIcon,
  KeyIcon,
  LockIcon,
  UserIcon,
  PasswordIcon,
  WifiIcon,
  PassPhraseIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'

/**
 * @type {Record<string, import('react').ElementType>}
 */
export const RECORD_ICON_BY_TYPE = {
  all: KeyIcon,
  login: UserIcon,
  identity: FullBodyIcon,
  creditCard: CreditCardIcon,
  note: NoteIcon,
  custom: LockIcon,
  password: PasswordIcon,
  wifiPassword: WifiIcon,
  passPhrase: PassPhraseIcon
}
