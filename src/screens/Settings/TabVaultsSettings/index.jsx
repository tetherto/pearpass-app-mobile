import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { PROTECTED_VAULT_ENABLED } from '@tetherto/pearpass-lib-constants'
import { BackIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider/native'
import { useVault } from '@tetherto/pearpass-lib-vault'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import { VAULT_ACTION } from '../../../constants/vaultActions'
import { ModifyVaultModalContent } from '../../../containers/Modal/ModifyVaultModalContent'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useModal } from '../../../context/ModalContext'
import { ButtonLittle } from '../../../libComponents'
import { settingsStyles } from '../styles'

const VaultActionSheet = ({ vaultId, vaultName }) => {
  const { t } = useLingui()
  const { collapse } = useBottomSheet()
  const { openModal } = useModal()

  const handleName = () => {
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
      <View style={sheetStyles.header}>
        <Text
          style={sheetStyles.title}
        >{t`What would you like to modify?`}</Text>
      </View>
      <BottomSheetScrollView
        style={sheetStyles.scrollView}
        contentContainerStyle={sheetStyles.scrollContent}
      >
        <View style={sheetStyles.buttonsContainer}>
          <TouchableOpacity style={sheetStyles.button} onPress={handleName}>
            <Text style={sheetStyles.buttonText}>{t`Change vault name`}</Text>
          </TouchableOpacity>
          {PROTECTED_VAULT_ENABLED && (
            <TouchableOpacity
              style={sheetStyles.button}
              onPress={handlePassword}
            >
              <Text
                style={sheetStyles.buttonText}
              >{t`Change vault password`}</Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetScrollView>
    </>
  )
}

const sheetStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
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

export const VaultsManageSection = () => {
  const { t } = useLingui()
  const { expand } = useBottomSheet()
  const { data: vault } = useVault()

  const handleVaultEditClick = (vaultId, vaultName) => {
    const snapPoints = PROTECTED_VAULT_ENABLED ? ['30%', '90%'] : ['20%', '90%']
    expand({
      children: <VaultActionSheet vaultId={vaultId} vaultName={vaultName} />,
      snapPoints,
      enableContentPanningGesture: false
    })
  }

  return (
    <CardSingleSetting title={t`Your Vault`}>
      <View style={styles.sectionContent}>
        <Text style={styles.description}>
          {t`Share, edit, or delete your vault from one place.`}
        </Text>
        <ListItem
          key={vault.id}
          name={vault?.name ?? vault?.id}
          date={vault.createdAt}
          testID="vault-item"
          accessibilityLabel="vault-item"
          nameTestID="vault-name"
          nameAccessibilityLabel="Vault Name"
          dateTestID="vault-date"
          dateAccessibilityLabel="Vault Date"
          onEditClick={() => handleVaultEditClick(vault.id, vault.name)}
        />
      </View>
    </CardSingleSetting>
  )
}

const styles = StyleSheet.create({
  sectionContent: {
    gap: 15
  },
  description: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400'
  }
})

export const TabVaultsSettings = () => {
  const { t } = useLingui()
  const navigation = useNavigation()

  return (
    <SafeAreaView
      style={settingsStyles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={settingsStyles.header}>
        <ButtonLittle
          startIcon={BackIcon}
          variant="secondary"
          borderRadius="md"
          onPress={() => navigation.goBack()}
        />
        <Text style={settingsStyles.screenTitle}>{t`Vaults`}</Text>
      </View>
      <ScrollView contentContainerStyle={settingsStyles.contentContainer}>
        <VaultsManageSection />
      </ScrollView>
    </SafeAreaView>
  )
}
