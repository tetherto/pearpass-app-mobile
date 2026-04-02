import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = () => ({
  dragHandleArea: {
    alignItems: 'center',
    paddingTop: rawTokens.spacing12,
    paddingBottom: rawTokens.spacing8
  },
  dragHandle: {
    width: 32,
    height: 4,
    borderRadius: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing8,
    paddingVertical: rawTokens.spacing8
  },
  headerSpacer: {
    width: 40,
    height: 40
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center'
  }
})
