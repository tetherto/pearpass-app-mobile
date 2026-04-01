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
  }
})
