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
    gap: 8,
    paddingHorizontal: 32
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white.mode1
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.grey100.mode1,
    textAlign: 'center'
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
