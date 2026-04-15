import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  nextCodeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.grey100.mode1,
    borderRadius: 6
  },
  nextCodeButtonDisabled: {
    opacity: 0.5
  },
  nextCodeButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: colors.white.mode1
  },
  timerBarContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingTop: 4,
    paddingHorizontal: 10,
    paddingBottom: 6
  },
  timerBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 20,
    backgroundColor: `${colors.grey100.mode1}33`,
    overflow: 'hidden' as const
  },
  timerText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500' as const,
    minWidth: 22,
    textAlign: 'right' as const
  }
})
