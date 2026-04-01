import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.colorBorderPrimary
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
