import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.grey500.mode1
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 32
  },
  emptyTextGroup: {
    alignItems: 'center',
    gap: 6
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white.mode1
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.grey100.mode1,
    textAlign: 'center',
    lineHeight: 20
  },
  emptyCTAs: {
    width: '100%',
    gap: 10
  },
  emptyPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary400.mode1
  },
  emptyPrimaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey500.mode1
  },
  emptySecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.grey300.mode1
  },
  emptySecondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary400.mode1
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 6
  },
  groupLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white.mode1
  },
  groupTimeValue: {
    fontSize: 14,
    fontWeight: '600'
  },
  groupDivider: {
    height: 1,
    backgroundColor: `${colors.grey100.mode1}33`,
    marginTop: 8,
    marginHorizontal: 16
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12
  },
  recordTextContainer: {
    flex: 1
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white.mode1
  },
  recordSubText: {
    fontSize: 12,
    color: colors.grey100.mode1,
    marginTop: 2
  },
  otpCode: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: colors.white.mode1,
    letterSpacing: 1
  }
})
