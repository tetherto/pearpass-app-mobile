import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.colorSurfacePrimary,
    borderTopLeftRadius: rawTokens.radius16,
    borderTopRightRadius: rawTokens.radius16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.colorBorderPrimary,
    overflow: 'hidden'
  }
})
