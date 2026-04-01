import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing12,
    padding: rawTokens.spacing12,
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: rawTokens.radius8,
    borderWidth: 1.5,
    borderColor: colors.colorBorderSecondary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: colors.colorPrimary,
    borderColor: colors.colorPrimary
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    flexShrink: 0
  },
  chevron: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
