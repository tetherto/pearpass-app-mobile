import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    paddingTop: rawTokens.spacing24,
  },
  content: {
    gap: rawTokens.spacing24
  },
  captions: {
    gap: rawTokens.spacing6
  },
  label: {
    fontFamily: rawTokens.fontDisplay,
    fontSize: rawTokens.fontSize28
  },
  protectionWrapper: {
    padding: rawTokens.spacing12,
    gap: rawTokens.spacing12,
    borderRadius: 8,
    borderWidth: 1
  },
  formWrapper: {
    gap: rawTokens.spacing12
  }
})
