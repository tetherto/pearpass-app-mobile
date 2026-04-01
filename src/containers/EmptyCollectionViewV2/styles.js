import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing40
  },
  title: {
    fontFamily: rawTokens.fontDisplay,
    fontSize: rawTokens.fontSize24,
    textAlign: 'center',
    marginTop: rawTokens.spacing24,
    marginBottom: rawTokens.spacing12
  },
  description: {
    color: colors.colorTextSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: rawTokens.spacing32,
    paddingHorizontal: rawTokens.spacing16
  },
  buttonsContainer: {
    width: '100%',
    gap: rawTokens.spacing8
  }
})
