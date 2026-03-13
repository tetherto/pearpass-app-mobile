import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20
  },
  itemSelected: {
    backgroundColor: 'rgba(186, 222, 91, 0.20)'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  itemTextContainer: {
    flex: 1,
    paddingLeft: 8
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter'
  },
  itemSubText: {
    color: colors.grey100.mode1,
    fontSize: 12,
    fontFamily: 'Inter'
  },
  itemOtpCode: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: colors.white.mode1,
    letterSpacing: 1
  }
})
