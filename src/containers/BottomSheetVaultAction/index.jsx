import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { PROTECTED_VAULT_ENABLED } from 'pearpass-lib-constants'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { VAULT_ACTION } from '../../constants/vaultActions'
import { ModifyVaultModalContent } from '../../containers/Modal/ModifyVaultModalContent'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import { useHapticFeedback } from '../../hooks/useHapticFeedback'

/**
 *
 * @param {Object} props - Component props
 * @param {string} props.vaultId - The unique identifier of the vault
 * @param {string} props.vaultName - The current name of the vault
 * @returns {JSX.Element} Bottom sheet with vault modification options
 *
 */
export const BottomSheetVaultAction = ({ vaultId, vaultName }) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()
  const { openModal } = useModal()
  const { hapticButtonPrimary } = useHapticFeedback()

  const handleName = () => {
    hapticButtonPrimary()
    collapse()
    openModal(
      <ModifyVaultModalContent
        vaultId={vaultId}
        vaultName={vaultName}
        action={VAULT_ACTION.NAME}
      />
    )
  }

  const handlePassword = () => {
    hapticButtonPrimary()
    collapse()
    openModal(
      <ModifyVaultModalContent
        vaultId={vaultId}
        vaultName={vaultName}
        action={VAULT_ACTION.PASSWORD}
      />
    )
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{t`What would you like to modify?`}</Text>
      </View>

      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleName}>
            <Text style={styles.buttonText}>{t`Change vault name`}</Text>
          </TouchableOpacity>
          {PROTECTED_VAULT_ENABLED && (
            <TouchableOpacity style={styles.button} onPress={handlePassword}>
              <Text style={styles.buttonText}>{t`Change vault password`}</Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    textAlign: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20
  },
  scrollContent: {
    paddingBottom: 40
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 12
  },
  button: {
    backgroundColor: colors.primary400.mode1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.black.mode1,
    fontSize: 16,
    fontWeight: '600'
  }
})
