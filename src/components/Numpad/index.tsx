import { Title, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Backspace,
  FaceId,
  Fingerprint
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { Pressable, View } from 'react-native'

import { styles } from './styles'

export enum BiometricType {
  Face = 'face',
  Fingerprint = 'fingerprint'
}

enum NumpadKey {
  Biometric = 'biometric',
  Backspace = 'backspace'
}

interface NumpadProps {
  onDigitPress: (digit: string) => void
  onBackspacePress: () => void
  onBiometricPress?: () => void
  biometricType?: BiometricType | null
  testIDPrefix?: string
}

const ROWS: (number | NumpadKey)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [NumpadKey.Biometric, 0, NumpadKey.Backspace]
]

export const Numpad = ({
  onDigitPress,
  onBackspacePress,
  onBiometricPress,
  biometricType,
  testIDPrefix = 'pin'
}: NumpadProps) => {
  const { theme } = useTheme()
  const iconColor = theme.colors.colorTextSecondary

  return (
    <View style={styles.container}>
      {ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => {
            if (item === NumpadKey.Biometric) {
              if (!biometricType) {
                return <View key={NumpadKey.Biometric} style={styles.button} />
              }
              return (
                <Pressable
                  key={NumpadKey.Biometric}
                  style={styles.button}
                  onPress={onBiometricPress}
                  testID={`${testIDPrefix}-biometric-button`}
                >
                  {biometricType === BiometricType.Face ? (
                    <FaceId color={iconColor} />
                  ) : (
                    <Fingerprint color={iconColor} />
                  )}
                </Pressable>
              )
            }

            if (item === NumpadKey.Backspace) {
              return (
                <Pressable
                  key={NumpadKey.Backspace}
                  style={styles.button}
                  onPress={onBackspacePress}
                  testID={`${testIDPrefix}-backspace-button`}
                >
                  <Backspace color={iconColor} />
                </Pressable>
              )
            }

            return (
              <Pressable
                key={item}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed
                ]}
                onPress={() => onDigitPress(String(item))}
                testID={`${testIDPrefix}-pad-${item}`}
              >
                <Title>{item}</Title>
              </Pressable>
            )
          })}
        </View>
      ))}
    </View>
  )
}
