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
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorBorderPrimary
  },
  itemActive: {
    backgroundColor: colors.colorSurfaceElevated
  },
  itemLabel: {
    flex: 1
  },
  count: {
    color: colors.colorTextSecondary
  }
})
