import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing12,
    gap: rawTokens.spacing24
  },
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
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.colorBorderSecondary,
    paddingTop: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing24,
    paddingHorizontal: rawTokens.spacing16
  }
})
