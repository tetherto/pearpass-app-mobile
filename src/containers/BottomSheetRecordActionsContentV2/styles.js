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
  }
})
