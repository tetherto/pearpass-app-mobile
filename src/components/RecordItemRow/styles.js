import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing12
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: rawTokens.radius8,
    overflow: 'hidden',
    backgroundColor: colors.colorSurfaceHover,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: rawTokens.radius8
  },
  content: {
    flex: 1,
    gap: 2
  }
})
