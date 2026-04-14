import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { PROTECTED_VAULT_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  ListItem,
  Text,
  Title,
  rawTokens,
  useBottomSheetClose,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  KeyboardArrowRightOutlined,
  LockOutlined,
  Share,
  Swap,
  TrashOutlined,
  VerifiedUser
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'

import { useHapticFeedback } from '../../hooks/useHapticFeedback'

/**
 * @param {Object} props - Component props
 * @param {string} props.vaultName - The current name of the vault
 * @param {() => void} [props.onRename] - Callback when rename action is selected
 * @param {() => void} [props.onPassword] - Callback when set password action is selected
 * @param {() => void} [props.onMembers] - Callback when manage access action is selected
 * @param {() => void} [props.onShare] - Callback when share action is selected
 * @param {() => void} [props.onDelete] - Callback when delete action is selected
 * @returns {JSX.Element} Bottom sheet with vault modification options
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
  const { theme } = useTheme()
  const collapse = useBottomSheetClose()
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
        <Text variant="caption" color={theme.colors.colorPrimary}>
          {t`Vault actions`}
        </Text>
        <Title as="h2">{vaultName}</Title>
        <Text as="p" variant="label" color={theme.colors.colorTextSecondary}>
          {t`Jump straight to the action you need without leaving the settings hub.`}
        </Text>
      </View>

      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.buttonsContainer}>
          <ListItem
            title={t`Rename Vault`}
            subtitle={t`Update the identity shown across devices.`}
            icon={<Swap color={theme.colors.colorTextPrimary} />}
            rightElement={
              <KeyboardArrowRightOutlined
                color={theme.colors.colorTextSecondary}
              />
            }
            platform="mobile"
            showDivider={false}
            onClick={handleName}
          />
          {PROTECTED_VAULT_ENABLED && (
            <ListItem
              title={t`Set Vault Password`}
              subtitle={t`Add or rotate the extra encryption layer.`}
              icon={<LockOutlined color={theme.colors.colorTextPrimary} />}
              rightElement={
                <KeyboardArrowRightOutlined
                  color={theme.colors.colorTextSecondary}
                />
              }
              platform="mobile"
              showDivider={false}
              onClick={handlePassword}
            />
          )}
          <ListItem
            title={t`Manage Access`}
            subtitle={t`Review owner access and linked devices.`}
            icon={<VerifiedUser color={theme.colors.colorTextPrimary} />}
            rightElement={
              <KeyboardArrowRightOutlined
                color={theme.colors.colorTextSecondary}
              />
            }
            platform="mobile"
            showDivider={false}
            onClick={() => {
              handleAction()
              onMembers?.()
            }}
          />
          <ListItem
            title={t`Share Personal Vault`}
            subtitle={t`Open the QR code flow for pairing a trusted device.`}
            icon={<Share color={theme.colors.colorTextPrimary} />}
            rightElement={
              <KeyboardArrowRightOutlined
                color={theme.colors.colorTextSecondary}
              />
            }
            platform="mobile"
            showDivider={false}
            onClick={() => {
              handleAction()
              onShare?.()
            }}
          />
          <ListItem
            title={t`Delete Vault`}
            subtitle={t`Requires master password confirmation before removal.`}
            icon={
              <TrashOutlined
                color={theme.colors.colorSurfaceDestructiveElevated}
              />
            }
            rightElement={
              <KeyboardArrowRightOutlined
                color={theme.colors.colorSurfaceDestructiveElevated}
              />
            }
            variant="destructive"
            platform="mobile"
            showDivider={false}
            onClick={() => {
              handleAction()
              onDelete?.()
            }}
          />
        </View>
      </BottomSheetScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: rawTokens.spacing20,
    paddingTop: rawTokens.spacing20,
    paddingBottom: rawTokens.spacing8,
    gap: rawTokens.spacing6
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: rawTokens.spacing20
  },
  scrollContent: {
    paddingBottom: rawTokens.spacing20 * 2
  },
  buttonsContainer: {
    marginTop: 8,
    gap: rawTokens.spacing12
  }
})
