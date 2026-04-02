import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorBorderPrimary
  },
  itemLabel: {
    flex: 1
  },
  destructiveLabel: {
    flex: 1,
    color: colors.colorTextDestructive
  }
})
