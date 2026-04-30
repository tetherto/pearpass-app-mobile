import { useBottomSheetModal } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { PROTECTED_VAULT_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  Button,
  NavbarListItem,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Close,
  EditOutlined,
  KeyboardArrowLeftOutlined,
  LockOutlined,
  Share,
  TrashOutlined
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { InteractionManager, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useHapticFeedback } from '../../hooks/useHapticFeedback'
import { Layout } from '../Layout'

const VaultActionHeader = ({ title, onBack, onClose, showBackButton }) => {
  const { t } = useLingui()
  const { theme } = useTheme()

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <Button
          variant="tertiary"
          size="medium"
          aria-label={t`Back`}
          iconBefore={
            <KeyboardArrowLeftOutlined color={theme.colors.colorTextPrimary} />
          }
          onClick={onBack}
        />
      ) : (
        <View style={styles.headerSpacer} />
      )}

      <View style={styles.headerTitleWrap}>
        <Text variant="bodyEmphasized" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <Button
        variant="tertiary"
        size="medium"
        aria-label={t`Close`}
        iconBefore={<Close color={theme.colors.colorTextPrimary} />}
        onClick={onClose}
      />
    </View>
  )
}

/**
 * @param {Object} props
 * @param {string} props.vaultName
 * @param {() => void} [props.onRename]
 * @param {() => void} [props.onPassword]
 * @param {() => void} [props.onShare]
 * @param {() => void} [props.onDelete]
 * @param {() => void} [props.onBack]
 * @param {() => void} [props.onClose]
 * @param {boolean} [props.showBackButton]
 * @param {boolean} [props.unsupportedFeaturesEnabled]
 */
export const BottomSheetVaultAction = ({
  vaultName,
  onRename,
  onPassword,
  onShare,
  onDelete,
  onBack,
  onClose,
  showBackButton = false,
  unsupportedFeaturesEnabled = false
}) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const { dismiss, dismissAll } = useBottomSheetModal()
  const { bottom } = useSafeAreaInsets()
  const { hapticButtonPrimary } = useHapticFeedback()

  const handleBack = onBack ?? dismiss
  const handleClose = onClose ?? dismiss

  const closeAndRun = (action) => {
    hapticButtonPrimary()
    if (onClose) {
      onClose()
    } else {
      dismissAll()
    }
    InteractionManager.runAfterInteractions(() => {
      action?.()
    })
  }

  const actions = [
    {
      key: 'rename',
      label: t`Rename Vault`,
      icon: <EditOutlined color={theme.colors.colorTextPrimary} />,
      onClick: () => closeAndRun(onRename)
    },
    ...(PROTECTED_VAULT_ENABLED
      ? [
          {
            key: 'password',
            label: t`Set Vault Password`,
            icon: <LockOutlined color={theme.colors.colorTextPrimary} />,
            onClick: () => closeAndRun(onPassword)
          }
        ]
      : []),
    ...(unsupportedFeaturesEnabled
      ? [
          {
            key: 'share',
            label: t`Share Personal Vault`,
            icon: <Share color={theme.colors.colorTextPrimary} />,
            onClick: () => closeAndRun(onShare)
          },
          {
            key: 'delete',
            label: t`Delete Vault`,
            icon: (
              <TrashOutlined
                color={theme.colors.colorSurfaceDestructiveElevated}
              />
            ),
            variant: 'destructive',
            onClick: () => closeAndRun(onDelete)
          }
        ]
      : [])
  ]

  return (
    <Layout
      mode="sheet"
      scrollable
      contentStyle={{ padding: 0, paddingBottom: bottom }}
      header={
        <VaultActionHeader
          title={vaultName}
          onBack={handleBack}
          onClose={handleClose}
          showBackButton={showBackButton}
        />
      }
    >
      {actions.map((action, index) => (
        <NavbarListItem
          key={action.key}
          platform="mobile"
          icon={action.icon}
          label={action.label}
          variant={action.variant ?? 'default'}
          showDivider={index < actions.length - 1}
          onClick={action.onClick}
        />
      ))}
    </Layout>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rawTokens.spacing8,
    paddingVertical: rawTokens.spacing8,
    gap: rawTokens.spacing8
  },
  headerSpacer: {
    width: 40,
    height: 40
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center'
  }
})
