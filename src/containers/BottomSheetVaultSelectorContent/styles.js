import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'

export const createStyles = (colors) => ({
  dragHandleArea: {
    alignItems: 'center',
    paddingTop: rawTokens.spacing12,
    paddingBottom: rawTokens.spacing8
  },
  dragHandle: {
    width: 32,
    height: 4,
    borderRadius: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing8,
    paddingVertical: rawTokens.spacing8
  },
  headerSpacer: {
    width: 40,
    height: 40
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rawTokens.spacing8,
    padding: rawTokens.spacing16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorBorderPrimary
  },
  itemActive: {
    backgroundColor: colors.colorSurfaceHover
  },
  labelContainer: {
    flex: 1,
    gap: 2,
    minHeight: 36,
    justifyContent: 'center'
  }
})
