import { ComponentProps } from 'react'

import {
  Button,
  DateField as KitDateField,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'

type Props = ComponentProps<typeof KitDateField>

export const ClearableDateField = ({ value, onChangeText, ...props }: Props) => {
  const { theme } = useTheme()

  return (
    <View style={styles.wrapper}>
      <KitDateField value={value} onChangeText={onChangeText} {...props} />

      {!!value && (
        <View style={styles.clearButton} pointerEvents="box-none">
          <Button
            size="small"
            variant="tertiary"
            aria-label="Clear date"
            iconBefore={<Close color={theme.colors.colorTextPrimary} />}
            onClick={() => onChangeText?.('')}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative'
  },
  clearButton: {
    position: 'absolute',
    right: rawTokens.spacing12,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  }
})
