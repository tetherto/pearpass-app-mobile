import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { Text, StyleSheet } from 'react-native'

/**
 * Bottom sheet tooltip that explains how the auto-lock feature works.
 * @component
 * @returns {JSX.Element}
 */
export const BottomSheetAutoLockTooltip = () => {
  const { t } = useLingui()

  return (
    <BottomSheetView style={styles.container}>
      <Text style={styles.title}>{t`Auto Log-out`}</Text>
      <Text style={styles.description}>
        {t`• Auto-lock determines how long Pearpass stays unlocked when you're not actively using it.`}
      </Text>
      <Text style={styles.description}>
        {t`• Inactivity is based on your interaction with Pearpass, not on device idle time.`}
      </Text>
    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white.mode1,
    lineHeight: 24,
    marginTop: 25,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.white.mode1,
    marginTop: 10
  }
})
