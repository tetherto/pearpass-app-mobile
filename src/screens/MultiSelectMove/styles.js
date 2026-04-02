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
  folderSection: {
    gap: rawTokens.spacing8
  },
  folderList: {
    gap: rawTokens.spacing12
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing4,
    padding: rawTokens.spacing12,
    borderRadius: rawTokens.radius8,
    borderWidth: 1,
    borderColor: colors.colorBorderSecondary
  },
  folderItemSelected: {
    backgroundColor: colors.colorSurfaceElevatedOnInteraction
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.colorBorderSecondary,
    paddingTop: rawTokens.spacing16,
    paddingBottom: rawTokens.spacing24,
    paddingHorizontal: rawTokens.spacing16
  }
})
