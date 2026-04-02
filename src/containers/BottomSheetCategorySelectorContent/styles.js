import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing8,
    paddingVertical: rawTokens.spacing8,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorBorderPrimary
  }
})
