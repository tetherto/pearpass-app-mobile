import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flex: 1
  },
  recordsSection: {
    position: 'relative'
  },
  recordsScroll: {
    paddingHorizontal: rawTokens.spacing12
  },
  recordsContent: {},
  sectionLabel: {
    color: colors.colorTextSecondary,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing12
  },
  recordItem: {
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  confirmText: {
    color: colors.colorTextSecondary,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing12
  }
})
