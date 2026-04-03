import { StyleSheet } from 'react-native'
import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: rawTokens.spacing4
  },
  imageContainer: {
    flexGrow: 1,
    padding: rawTokens.spacing16
  },
  imageCard: {
    borderRadius: rawTokens.spacing16,
    overflow: 'hidden',
    elevation: rawTokens.spacing4
  },
  styledImage: {
    width: '100%'
  }
})
