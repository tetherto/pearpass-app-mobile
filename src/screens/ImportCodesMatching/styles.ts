import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    paddingTop: rawTokens.spacing24
  },
  content: {
    gap: rawTokens.spacing24
  },
  captions: {
    gap: rawTokens.spacing6
  },
  listSection: {
    gap: rawTokens.spacing12
  },
  listWrapper: {
    borderRadius: rawTokens.spacing8,
    borderWidth: 1
  }
})
