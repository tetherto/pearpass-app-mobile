import { useLingui } from '@lingui/react/macro'
import {
  Button,
  PageHeader,
  rawTokens,
  Text,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { StyleSheet, View } from 'react-native'

import { useModal } from '../../../context/ModalContext'

/**
 * @param {{
 *   vaultName: string
 *   deviceName?: string
 * }} props
 */
export const AccessRemovedModalContent = ({ vaultName, deviceName }) => {
  const { closeModal } = useModal()
  const { t } = useLingui()
  const { theme } = useTheme()

  const lead = deviceName
    ? t`Your access to ${vaultName} has been removed by ${deviceName}.`
    : t`Your access to ${vaultName} has been removed.`

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.colorSurfacePrimary,
          borderColor: theme.colors.colorBorderPrimary
        }
      ]}
      testID="access-removed-modal"
    >
      <View style={styles.content}>
        <PageHeader
          title={t`Access Removed`}
          testID="access-removed-modal-header"
        />

        <View style={styles.body}>
          <Text variant="label" testID="access-removed-modal-lead">
            {lead}
          </Text>
          <Text variant="label">
            {t`This vault will no longer be available on this device.`}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { borderTopColor: theme.colors.colorBorderPrimary }
        ]}
      >
        <Button
          variant="primary"
          size="medium"
          fullWidth
          onClick={closeModal}
          testID="access-removed-modal-understood-button"
        >
          {t`Understood`}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: rawTokens.spacing20,
    overflow: 'hidden'
  },
  content: {
    padding: rawTokens.spacing16,
    gap: rawTokens.spacing20
  },
  body: {
    gap: rawTokens.spacing4
  },
  footer: {
    padding: rawTokens.spacing16,
    borderTopWidth: 1
  }
})
