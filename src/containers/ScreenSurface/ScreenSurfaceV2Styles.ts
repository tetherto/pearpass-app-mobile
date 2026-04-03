import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  surface: {
    flex: 1,
    borderTopLeftRadius: rawTokens.spacing16,
    borderTopRightRadius: rawTokens.spacing16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    padding: rawTokens.spacing16
  },
  content: {
    flex: 1,
    padding: rawTokens.spacing16
  },
  footer: {
    borderWidth: 1,
    paddingTop: rawTokens.spacing16,
    paddingHorizontal: rawTokens.spacing16
  },
  footerWithContent: {
    borderTopWidth: 1
  }
})
