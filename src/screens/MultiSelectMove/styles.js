import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

import { FADE_GRADIENT_HEIGHT } from '../../components/FadeGradient'

export const createStyles = (colors) => ({
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
  folderSectionLabel: {
    color: colors.colorTextSecondary,
    paddingTop: rawTokens.spacing12
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
    height: FADE_GRADIENT_HEIGHT
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
    height: FADE_GRADIENT_HEIGHT
  }
})
