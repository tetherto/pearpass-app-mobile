import { StyleSheet } from 'react-native'

import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: rawTokens.spacing16,
    gap: rawTokens.spacing24
  },
  titleContainer: {
    alignItems: 'center',
    gap: rawTokens.spacing8
  },
  pinSlotsContainer: {
    paddingTop: rawTokens.spacing8
  },
  numpadContainer: {
    paddingTop: rawTokens.spacing16
  },
  footerText: {
    textAlign: 'center',
    paddingBottom: rawTokens.spacing16
  },
  passwordContainer: {
    gap: rawTokens.spacing24
  },
  linkContainer: {
    alignItems: 'center'
  },
  buttonContainer: {
    gap: rawTokens.spacing16
  }
})
