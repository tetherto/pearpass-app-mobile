import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.colorBorderPrimary,
    overflow: 'hidden'
  },
  breadcrumbScrollWrapper: {
    flex: 1,
    overflow: 'hidden'
  },
  breadcrumbScrollContainer: {
    flex: 1,
    height: 57
  },
  fadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  fadeRight: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  breadcrumbScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing8
  },
  breadcrumbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    paddingHorizontal: rawTokens.spacing12,
    paddingVertical: rawTokens.spacing12,
    borderRadius: rawTokens.radius8,
    borderWidth: 1,
    borderColor: colors.colorBorderSecondary
  },
  chevronSeparator: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    paddingHorizontal: rawTokens.spacing8,
    paddingVertical: rawTokens.spacing8,
    borderLeftWidth: 1,
    borderLeftColor: colors.colorBorderPrimary,
    backgroundColor: colors.colorSurfacePrimary,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: rawTokens.radius8,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
