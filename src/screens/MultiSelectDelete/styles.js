import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  section: {
    gap: rawTokens.spacing12
  },
  sectionLabel: {
    color: colors.colorTextSecondary
  },
  recordItem: {
    padding: rawTokens.spacing12
  },
  confirmText: {
    color: colors.colorTextSecondary
  }
})
