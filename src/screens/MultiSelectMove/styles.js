import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  recordsSection: {
    position: 'relative'
  },
  recordsScroll: {
    paddingHorizontal: rawTokens.spacing16
  },
  recordsContent: {
    paddingTop: rawTokens.spacing12,
    paddingBottom: rawTokens.spacing12,
    gap: rawTokens.spacing8
  },
  sectionLabel: {
    color: colors.colorTextSecondary
  },
  recordItem: {
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70
  },
  foldersSection: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing12,
    paddingBottom: rawTokens.spacing12,
    gap: rawTokens.spacing8
  },
  foldersList: {
    gap: rawTokens.spacing12
  },
  folderButton: {
    borderRadius: rawTokens.radius8,
    justifyContent: 'flex-start'
  },
  foldersFadeGradient: {
    position: 'absolute',
    bottom: rawTokens.spacing12,
    left: 0,
    right: 0,
    height: 70
  }
})
