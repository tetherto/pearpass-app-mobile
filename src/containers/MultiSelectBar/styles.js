import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.colorBorderPrimary
  },
  backSection: {
    borderRightWidth: 1,
    borderRightColor: colors.colorBorderPrimary,
    padding: rawTokens.spacing8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorSurfacePrimary
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing8
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4
  },
  deleteSection: {
    borderLeftWidth: 1,
    borderLeftColor: colors.colorBorderPrimary,
    padding: rawTokens.spacing8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorSurfacePrimary
  }
})
