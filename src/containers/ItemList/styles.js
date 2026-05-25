import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  contentContainer: {
    flex: 1,
    position: 'relative'
  },
  sectionList: {
    flex: 1,
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing12
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    paddingVertical: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing4
  },
  sectionHeaderChevron: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  recordItem: {
    borderRadius: rawTokens.radius8,
    overflow: 'hidden'
  },
  chevronRight: {
    transform: [{ rotate: '-90deg' }]
  },
  divider: {
    height: 1,
    backgroundColor: colors.colorBorderPrimary,
    marginVertical: rawTokens.spacing8
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1
  },
  itemTitle: {
    fontWeight: '500'
  },
  itemSubtitle: {
    fontWeight: '400',
    color: '#BDC3AC'
  }
})
