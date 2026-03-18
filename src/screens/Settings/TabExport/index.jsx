import { useEffect, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  authoriseCurrentProtectedVault,
  getCurrentProtectedVaultEncryption,
  getMasterEncryption,
  getVaultById,
  listRecords,
  useVault
} from '@tetherto/pearpass-lib-vault'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { RadioSelect } from '../../../components/RadioSelect'
import { BottomSheetCreateFilePasswordContent } from '../../../containers/BottomSheetCreateFilePasswordContent'
import { BottomSheetMasterPassword } from '../../../containers/BottomSheetMasterPassword'
import { RuleSelector } from '../../../containers/BottomSheetPassGeneratorContent/RuleSelector'
import { VaultPasswordFormModalContent } from '../../../containers/Modal/VaultPasswordFormModalContent'
import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useModal } from '../../../context/ModalContext'
import { ButtonLittle, ButtonSecondary } from '../../../libComponents'
import { settingsStyles } from '../styles'
import {
  Description,
  ExportButton,
  Container as ExportContainer,
  ExportFormat
} from './styles'
import {
  handleExportCSVPerVault,
  handleExportJsonPerVault
} from './utils/exportVaults'

export const ExportSection = () => {
  const { t } = useLingui()

  const { expand, collapse } = useBottomSheet()
  const { closeModal, openModal } = useModal()
  const { setShouldBypassAutoLock } = useAutoLockContext()
  const {
    isVaultProtected,
    refetch: refetchVault,
    data: currentVault
  } = useVault()

  const [exportType, setExportType] = useState('json')
  const [selectedRules, setSelectedRules] = useState({
    encryption: false
  })

  const radioOptions = [
    { label: t`CSV`, value: 'csv' },
    { label: t`JSON (Recommended)`, value: 'json' }
  ]

  const ruleOptions = [
    {
      name: 'encryption',
      label: t`Protect with Password`,
      description: t`Protect your exported file so it can only be opened with the password you set`,
      testIDOn: 'encryption-toggle-on',
      testIDOff: 'encryption-toggle-off',
      accessibilityLabelOn: t`Encryption enabled`,
      accessibilityLabelOff: t`Encryption disabled`
    }
  ]

  const handleSetRules = async (newRules) => {
    if (newRules.encryption) {
      setSelectedRules((prev) => ({ ...prev, encryption: true }))
    } else {
      setSelectedRules((prev) => ({ ...prev, encryption: false }))
    }
  }

  const handleSubmitExport = async (
    vaultsToExport,
    encryptionPassword = null
  ) => {
    try {
      let isSuccess = false

      if (exportType === 'json') {
        isSuccess = await handleExportJsonPerVault(
          vaultsToExport,
          encryptionPassword
        )
      } else if (exportType === 'csv') {
        isSuccess = await handleExportCSVPerVault(vaultsToExport)
      }

      if (isSuccess) {
        Toast.show({
          type: 'success',
          text1: t`Export successful`,
          text2: t`Vault is ready to be exported`,
          position: 'bottom',
          bottomOffset: 100
        })
      } else {
        Toast.show({
          type: 'info',
          text1: t`No data to export`,
          text2: t`The selected vault contain no records to export`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t`Export failed`,
        text2: error.message || t`An error occurred while exporting your data`,
        position: 'bottom',
        bottomOffset: 100
      })
    }
  }

  const fetchProtectedVault = async (
    password,
    currentVaultId,
    currentEncryption
  ) => {
    try {
      await authoriseCurrentProtectedVault(password)
      closeModal()

      let vault

      try {
        vault = await getVaultById(currentVaultId, {
          password: password
        })
      } catch (error) {
        await refetchVault(currentVaultId, currentEncryption)
        throw error
      }

      const records = (await listRecords()) ?? []
      const vaultData = [{ ...vault, records }]

      if (selectedRules.encryption) {
        expand({
          children: (
            <BottomSheetCreateFilePasswordContent
              onClose={() => collapse()}
              onConfirm={async (encryptionPassword) => {
                collapse()
                await handleSubmitExport(vaultData, encryptionPassword)
              }}
            />
          ),
          snapPoints: ['60%', '60%']
        })
      } else {
        await handleSubmitExport(vaultData, null)
      }

      await refetchVault(currentVaultId, currentEncryption)
    } catch (error) {
      throw error
    }
  }

  const fetchUnprotectedVault = async (vaultId) => {
    const vault = await getVaultById(vaultId)
    const records = (await listRecords()) ?? []

    return { ...vault, records }
  }

  const handleExport = async () => {
    const currentVaultId = currentVault?.id
    const isCurrentVaultProtected = await isVaultProtected(currentVaultId)
    const currentEncryption = isCurrentVaultProtected
      ? await getCurrentProtectedVaultEncryption(currentVaultId)
      : await getMasterEncryption()

    if (isCurrentVaultProtected) {
      openModal(
        <VaultPasswordFormModalContent
          vault={currentVault.id}
          onSubmit={async (password) => {
            try {
              setShouldBypassAutoLock(true)
              await fetchProtectedVault(
                password,
                currentVaultId,
                currentEncryption
              )
            } finally {
              setShouldBypassAutoLock(false)
            }
          }}
        />
      )
    } else {
      expand({
        children: (
          <BottomSheetMasterPassword
            onClose={() => {
              collapse()
            }}
            onConfirm={async () => {
              try {
                collapse()
                setShouldBypassAutoLock(true)
                const vaultsToExport =
                  await fetchUnprotectedVault(currentVaultId)

                refetchVault(currentVaultId, currentEncryption)

                if (selectedRules.encryption) {
                  expand({
                    children: (
                      <BottomSheetCreateFilePasswordContent
                        onClose={() => collapse()}
                        onConfirm={async (encryptionPassword) => {
                          collapse()
                          await handleSubmitExport(
                            [vaultsToExport],
                            encryptionPassword
                          )
                        }}
                      />
                    ),
                    snapPoints: ['40%', '50%']
                  })
                } else {
                  await handleSubmitExport([vaultsToExport])
                }
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: t`Export failed`,
                  text2:
                    error.message ||
                    t`An error occurred while exporting your vaults`,
                  position: 'bottom',
                  bottomOffset: 100
                })
              } finally {
                setShouldBypassAutoLock(false)
              }
            }}
          />
        ),
        snapPoints: ['45%', '45%']
      })
    }
  }

  useEffect(() => {
    refetchVault()
  }, [])

  return (
    <CardSingleSetting title={t`Export Vault`}>
      <ExportContainer>
        <Description>
          {t`Choose the file format to export your Vault`}
        </Description>
        <ExportFormat>
          <RadioSelect
            radioOptionStyle={styles.radioOptionTitle}
            options={radioOptions}
            selectedOption={exportType}
            onChange={(value) => {
              setSelectedRules((prev) => ({ ...prev, encryption: false }))
              setExportType(value)
            }}
            title={t`Choose the file format`}
          />
        </ExportFormat>

        {exportType === 'json' && (
          <RuleSelector
            rules={ruleOptions}
            selectedRules={selectedRules}
            setRules={handleSetRules}
          />
        )}

        <ExportButton>
          <ButtonSecondary onPress={handleExport} size="sm">
            {t`Export`}
          </ButtonSecondary>
        </ExportButton>
      </ExportContainer>
    </CardSingleSetting>
  )
}

export const TabExport = () => {
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
        <Text style={settingsStyles.screenTitle}>{t`Export`}</Text>
      </View>
      <ScrollView contentContainerStyle={settingsStyles.contentContainer}>
        <ExportSection />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  radioOptionTitle: {
    fontSize: 14
  }
})
