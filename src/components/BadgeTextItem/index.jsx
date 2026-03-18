import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { View, Text, StyleSheet } from 'react-native'

/**
 * @param {{
 *  count: number,
 *  word: string,
 *  isNumberVisible?: boolean
 * }} props
 */

export const BadgeTextItem = ({ count, word, isNumberVisible = true }) => (
  <View style={styles.container}>
    {isNumberVisible && <Text style={styles.textCount}>#{count}</Text>}
    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
      {word}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.grey500?.mode1,
    paddingHorizontal: 10,
    paddingVertical: 13.5,
    width: 105,
    borderRadius: 10,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 12,
    gap: 5
  },
  text: {
    fontWeight: 500,
    color: colors.white.mode1,
    maxWidth: '70%'
  },

  textCount: {
    fontWeight: 400,
    color: colors.grey100.mode1
  }
})
