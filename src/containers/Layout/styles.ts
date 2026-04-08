import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet } from 'react-native'

import { cardSurface } from '../../styles/cardSurface'

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  surface: cardSurface,
  sheetSurface: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  content: {
    flex: 1,
    padding: rawTokens.spacing16
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: rawTokens.spacing16,
    paddingHorizontal: rawTokens.spacing16
  }
})
