import { useEffect, useRef, createRef, type RefObject } from 'react'
import type { TextInput } from 'react-native'

import { InputField } from '@tetherto/pearpass-lib-ui-kit'
import { View } from 'react-native'

import { styles } from './styles'

interface PinSlotsProps {
  pin: string
  pinLength: number
  testIDPrefix?: string
}

export const PinSlots = ({
  pin,
  pinLength,
  testIDPrefix = 'pin-slot'
}: PinSlotsProps) => {
  const inputRefs = useRef<RefObject<TextInput | null>[]>(
    Array.from({ length: pinLength }, () => createRef<TextInput | null>())
  ).current

  useEffect(() => {
    inputRefs.forEach((ref) => {
      ;(ref.current as any)?.setNativeProps?.({
        showSoftInputOnFocus: false,
        style: { textAlign: 'center', marginTop: -8, marginBottom: 8 }
      })
    })
  }, [])

  useEffect(() => {
    const activeIndex = pin.length < pinLength ? pin.length : pinLength - 1
    ;(inputRefs[activeIndex]?.current as any)?.focus()
  }, [pin])

  return (
    <View style={styles.container}>
      {Array.from({ length: pinLength }).map((_, index) => {
        const isFilled = index < pin.length

        return (
          <View key={index} style={styles.slotWrapper}>
            <InputField
              label=""
              value={isFilled ? '\u2022' : ''}
              placeholder="0"
              inputRef={inputRefs[index] as any}
              testID={`${testIDPrefix}-${index}`}
            />
          </View>
        )
      })}
    </View>
  )
}
