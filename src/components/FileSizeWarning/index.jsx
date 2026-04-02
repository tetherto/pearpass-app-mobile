import { useLingui } from '@lingui/react/macro'
import { MAX_FILE_SIZE_MB } from '@tetherto/pearpass-lib-constants'
import { YellowErrorIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native'
import { useTheme } from 'styled-components/native'

/**
 * FileSizeWarning component displays a warning or informational message
 * regarding the maximum file size allowed for upload.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isFileSizeWarning
 * @param {boolean} [props.withMarginBottom=true]
 * @returns {JSX.Element}
 */

export const FileSizeWarning = ({
  isFileSizeWarning,
  withMarginBottom = true
}) => {
  const { t } = useLingui()
  const theme = useTheme()

  return (
    <View style={[styles.wrapper, { marginBottom: withMarginBottom ? 20 : 0 }]}>
      {isFileSizeWarning && <YellowErrorIcon size="14" />}
      <Text style={[styles.text, { color: theme.colors.white.mode1 }]}>
        {isFileSizeWarning
          ? t`Your file is too large. Please upload one that’s ${MAX_FILE_SIZE_MB} MB or smaller.`
          : t`Maximum file size: ${MAX_FILE_SIZE_MB} MB.`}
      </Text>
    </View>
  )
}

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 14
  }
})
