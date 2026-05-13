import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = () => ({
  scroll: {
    flex: 1
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing40
  },
  title: {
    marginTop: rawTokens.spacing24,
    marginBottom: rawTokens.spacing12
  },
  description: {
    marginBottom: rawTokens.spacing24
  },
  textCenter: {
    textAlign: 'center'
  },
  buttonsContainer: {
    width: '100%',
    gap: rawTokens.spacing8
  }
})
