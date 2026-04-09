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
  breadcrumbScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    paddingHorizontal: rawTokens.spacing16,
    paddingVertical: rawTokens.spacing8
  },
  breadcrumbPill: {
    gap: rawTokens.spacing8,
    borderColor: colors.colorBorderSecondary
  },
  breadcrumbText: {
    paddingVertical: rawTokens.spacing12,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  chevronSeparator: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonSection: {
    borderLeftWidth: 1,
    borderLeftColor: colors.colorBorderPrimary,
    padding: rawTokens.spacing8,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorSurfacePrimary
  }
})
