import { YellowErrorIcon } from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { View, Text, StyleSheet } from 'react-native'

/**
 * @param {{
 *  warning: string,
 *  containerStyles: object,
 *  textStyles: object,
 *  testID?: string
 *  textTestID?: string
 * }} props
 * @returns
 */
export const AppWarning = ({
  warning,
  containerStyles,
  textStyles,
  testID,
  textTestID
}) => (
  <View style={[styles.warningContainer, containerStyles]} testID={testID}>
    <YellowErrorIcon width={14} height={14} />
    <Text testID={textTestID} style={[styles.warningText, textStyles]}>
      {warning}
    </Text>
  </View>
)
const styles = StyleSheet.create({
  warningContainer: {
    width: '100%',
    backgroundColor: 'rgb(47, 38, 14)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.errorYellow.mode1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  warningText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.white.mode1,
    marginLeft: 5,
    flex: 1
  }
})
