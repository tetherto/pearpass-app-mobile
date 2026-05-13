import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = () => ({
  listItem: {
    paddingBlock: rawTokens.spacing16,
    paddingInline: rawTokens.spacing16
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4
  }
})
