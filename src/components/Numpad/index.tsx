import { Title, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import {
  Backspace,
  FaceId,
  Fingerprint
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { Pressable, View } from 'react-native'

import { styles } from './styles'

interface NumpadProps {
  onDigitPress: (digit: string) => void
  onBackspacePress: () => void
  onBiometricPress?: () => void
  biometricType?: 'face' | 'fingerprint' | null
  testIDPrefix?: string
}

const ROWS: (number | string)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ['biometric', 0, 'backspace']
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
            if (item === 'biometric') {
              if (!biometricType) {
                return <View key="biometric" style={styles.button} />
              }
              return (
                <Pressable
                  key="biometric"
                  style={styles.button}
                  onPress={onBiometricPress}
                  testID={`${testIDPrefix}-biometric-button`}
                >
                  {biometricType === 'face' ? (
                    <FaceId color={iconColor} />
                  ) : (
                    <Fingerprint color={iconColor} />
                  )}
                </Pressable>
              )
            }

            if (item === 'backspace') {
              return (
                <Pressable
                  key="backspace"
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
