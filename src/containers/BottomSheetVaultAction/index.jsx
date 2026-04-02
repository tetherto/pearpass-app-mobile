import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { PROTECTED_VAULT_ENABLED } from '@tetherto/pearpass-lib-constants'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useBottomSheet } from '../../context/BottomSheetContext'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

/**
 *
 * @param {Object} props - Component props
 * @param {string} props.vaultId - The unique identifier of the vault
 * @param {string} props.vaultName - The current name of the vault
 * @returns {JSX.Element} Bottom sheet with vault modification options
 *
 */
export const BottomSheetVaultAction = ({
  vaultName,
  onRename,
  onPassword,
  onMembers,
  onShare,
  onDelete
}) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()
  const { hapticButtonPrimary } = useHapticFeedback()

  const handleAction = () => {
    hapticButtonPrimary()
    collapse()
  }

  const handleName = () => {
    handleAction()
    onRename?.()
  }

  const handlePassword = () => {
    handleAction()
    onPassword?.()
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{t`Vault actions`}</Text>
        <Text style={styles.title}>{vaultName}</Text>
        <Text style={styles.subtitle}>
          {t`Jump straight to the action you need without leaving the settings hub.`}
        </Text>
      </View>

      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleName}>
            <Text style={styles.buttonLabel}>{t`Rename Vault`}</Text>
            <Text style={styles.buttonText}>
              {t`Update the identity shown across devices.`}
            </Text>
          </TouchableOpacity>
          {PROTECTED_VAULT_ENABLED && (
            <TouchableOpacity style={styles.button} onPress={handlePassword}>
              <Text style={styles.buttonLabel}>{t`Set Vault Password`}</Text>
              <Text style={styles.buttonText}>
                {t`Add or rotate the extra encryption layer.`}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleAction()
              onMembers?.()
            }}
          >
            <Text style={styles.buttonLabel}>{t`Manage Access`}</Text>
            <Text style={styles.buttonText}>
              {t`Review owner access and linked devices.`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleAction()
              onShare?.()
            }}
          >
            <Text style={styles.buttonLabel}>{t`Share Personal Vault`}</Text>
            <Text style={styles.buttonText}>
              {t`Open the QR code flow for pairing a trusted device.`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={() => {
              handleAction()
              onDelete?.()
            }}
          >
            <Text style={[styles.buttonLabel, styles.buttonLabelDanger]}>
              {t`Delete Vault`}
            </Text>
            <Text style={[styles.buttonText, styles.buttonTextDanger]}>
              {t`Requires master password confirmation before removal.`}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 6
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary400.mode1,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white.mode1,
    textAlign: 'left'
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.68)',
    lineHeight: 20
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20
  },
  scrollContent: {
    paddingBottom: 40
  },
  buttonsContainer: {
    marginTop: 8,
    gap: 12
  },
  button: {
    backgroundColor: '#12170D',
    padding: 16,
    borderRadius: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  buttonDanger: {
    borderColor: 'rgba(248,113,113,0.25)',
    backgroundColor: 'rgba(127,29,29,0.16)'
  },
  buttonLabel: {
    color: colors.white.mode1,
    fontSize: 15,
    fontWeight: '700'
  },
  buttonLabelDanger: {
    color: '#FCA5A5'
  },
  buttonText: {
    color: 'rgba(255,255,255,0.64)',
    fontSize: 13,
    lineHeight: 19
  },
  buttonTextDanger: {
    color: 'rgba(252,165,165,0.82)'
  }
})
