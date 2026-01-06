import { Text } from 'react-native'

import { HighlightedText, NumberSpan, SymbolSpan } from './styles'

/**
 * @param {{
 *  text: string,
 *  fontsize: string,
 *  fontWeight: number,
 *  numberOfLines: number
 *  testID?: string
 * }} props
 */
export const HighlightString = ({
  text,
  fontsize = '20px',
  fontWeight = 400,
  numberOfLines = undefined,
  testID
}) => (
  <HighlightedText
    numberOfLines={numberOfLines}
    size={fontsize}
    weight={fontWeight}
    testID={testID}
  >
    {highlightText(text)}
  </HighlightedText>
)

const highlightText = (text) => {
  const regex = /(\d+|[^a-zA-Z\d\s])/g
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (/^\d+$/.test(part)) {
      return <NumberSpan key={index}>{part}</NumberSpan>
    }

    if (/[^a-zA-Z\d\s]/.test(part)) {
      return <SymbolSpan key={index}>{part}</SymbolSpan>
    }

    return <Text key={index}>{part}</Text>
  })
}
