import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  content: {
    gap: rawTokens.spacing24
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4
  },
  captions: {
    gap: rawTokens.spacing6
  },
  importWrapper: {
    gap: rawTokens.spacing12
  },
  listWrapper: {
    borderRadius: rawTokens.spacing8,
    borderWidth: 1
  }
})
