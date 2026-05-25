import { StyleSheet, Text } from 'react-native'
import { colors } from 'src/utils/colors'

export const HighlightedText = ({ size, weight, style, ...rest }) => (
  <Text
    {...rest}
    style={[
      styles.highlightedText,
      { fontSize: size, fontWeight: weight },
      style
    ]}
  />
)

export const NumberSpan = (props) => (
  <Text {...props} style={[styles.numberSpan, props.style]} />
)

export const SymbolSpan = (props) => (
  <Text {...props} style={[styles.symbolSpan, props.style]} />
)

const styles = StyleSheet.create({
  highlightedText: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    textAlign: 'center'
  },
  numberSpan: {
    color: colors.primary400.mode1,
    fontWeight: 'bold'
  },
  symbolSpan: {
    color: colors.categoryLogin.mode1,
    fontWeight: 'bold'
  }
})
