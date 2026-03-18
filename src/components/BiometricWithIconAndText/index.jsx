import { useLingui } from '@lingui/react/macro'
import {
  FaceIdIcon,
  FingerprintIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import * as LocalAuthentication from 'expo-local-authentication'

import { Wrapper, PressableText } from './styles'

const { FACIAL_RECOGNITION, FINGERPRINT } =
  LocalAuthentication.AuthenticationType

const biometrics = {
  [FACIAL_RECOGNITION]: {
    Icon: FaceIdIcon,
    label: `Use Face ID`
  },
  [FINGERPRINT]: {
    Icon: FingerprintIcon,
    label: `Use Fingerprint`
  },
  [`${FINGERPRINT}-${FACIAL_RECOGNITION}`]: {
    Icon: null,
    label: 'Use Biometrics'
  }
}
/**
 * Component that renders a biometric login button with an icon and text
 * @param {Object} props
 * @param {LocalAuthentication.AuthenticationType} props.biometricType - Type of biometric authentication to display
 * @param {() => void} props.onPress - Function called when button is pressed
 * @returns {JSX.Element} Biometric login button with icon and text
 */

export const BiometricWithIconAndText = ({ biometricType, onPress }) => {
  const { t } = useLingui()
  const Icon = biometrics[biometricType].Icon
  const label = biometrics[biometricType].label
  return (
    <Wrapper onPress={onPress}>
      {Icon && <Icon size="21" color={colors.primary400.mode1} />}
      <PressableText testID="biometric-login-button">
        {t`${label}`}
      </PressableText>
    </Wrapper>
  )
}
