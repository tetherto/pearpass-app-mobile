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
  confirmText: {
    color: colors.colorTextSecondary,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing12
  }
})
