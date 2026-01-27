import { useEffect, useMemo, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import {
  authoriseCurrentProtectedVault,
  getCurrentProtectedVaultEncryption,
  getMasterEncryption,
  getVaultById,
  listRecords,
  useVault,
  useVaults
} from 'pearpass-lib-vault'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import {
  Container as ExportContainer,
  Description,
  ExportButton,
  ExportFormat,
  VaultsList
} from './styles'
import {
  handleExportCSVPerVault,
  handleExportJsonPerVault
} from './utils/exportVaults'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { ListItem } from '../../../components/ListItem'
import { RadioSelect } from '../../../components/RadioSelect'
import { BottomSheetMasterPassword } from '../../../containers/BottomSheetMasterPassword'
import { VaultPasswordFormModalContent } from '../../../containers/Modal/VaultPasswordFormModalContent'
import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useModal } from '../../../context/ModalContext'
import { ButtonLittle, ButtonSecondary } from '../../../libComponents'
import { sortAlphabetically } from '../../../utils/sortAlphabetically'
import { settingsStyles } from '../styles'

export const ExportSection = () => {
  const { t } = useLingui()

  const { expand, collapse } = useBottomSheet()
  const { closeModal, openModal } = useModal()
  const { setShouldBypassAutoLock } = useAutoLockContext()
  const { data } = useVaults()
  const {
    isVaultProtected,
    refetch: refetchVault,
    data: currentVault
  } = useVault()

  const [selectedVaults, setSelectedVaults] = useState([])
  const [selectedProtectedVault, setSelectedProtectedVault] = useState(null)
  const [exportType, setExportType] = useState('json')

  const radioOptions = [
    { label: t`csv`, value: 'csv' },
    { label: t`json`, value: 'json' }
  ]

  const sortedVaults = useMemo(() => sortAlphabetically(data), [data])

  const handleSubmitExport = async (vaultsToExport) => {
    try {
      let isSuccess = false

      if (exportType === 'json') {
        isSuccess = await handleExportJsonPerVault(vaultsToExport)
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

      setSelectedVaults([])
      setSelectedProtectedVault(null)
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
      if (currentVaultId === selectedProtectedVault?.id) {
        await authoriseCurrentProtectedVault(password)
        closeModal()
      }

      let vault

      try {
        vault = await getVaultById(selectedProtectedVault.id, {
          password: password
        })
      } catch (error) {
        await refetchVault(currentVaultId, currentEncryption)
        throw error
      }

      const records = (await listRecords()) ?? []

      await handleSubmitExport([{ ...vault, records }])

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

  const handleVaultClick = async (vault) => {
    const isProtected = await isVaultProtected(vault.id)

    if (isProtected) {
      setSelectedProtectedVault(
        selectedProtectedVault?.id === vault.id ? null : vault
      )
      setSelectedVaults([])
      return
    }

    setSelectedVaults((prev) =>
      prev.includes(vault.id)
        ? prev.filter((vaultId) => vaultId !== vault.id)
        : [...prev, vault.id]
    )
    setSelectedProtectedVault(null)
  }

  const handleExport = async () => {
    if (!selectedVaults.length && !selectedProtectedVault) {
      return
    }

    const currentVaultId = currentVault?.id
    const isCurrentVaultProtected = await isVaultProtected(currentVaultId)
    const currentEncryption = isCurrentVaultProtected
      ? await getCurrentProtectedVaultEncryption(currentVaultId)
      : await getMasterEncryption()

    if (selectedProtectedVault) {
      openModal(
        <VaultPasswordFormModalContent
          vault={selectedProtectedVault}
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
    } else if (selectedVaults.length > 0) {
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
                const vaultsToExport = await Promise.all(
                  selectedVaults.map(
                    async (vaultId) => await fetchUnprotectedVault(vaultId)
                  )
                )

                refetchVault(currentVaultId, currentEncryption)

                await handleSubmitExport(vaultsToExport)
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
        <VaultsList>
          {sortedVaults?.map((vault, index) => (
            <ListItem
              key={vault.id}
              name={vault.name}
              date={vault.createdAt}
              testID={`export-vault-item-${index}`}
              accessibilityLabel={`export-vault-item-${index}`}
              isSelected={
                selectedVaults.includes(vault.id) ||
                vault.id === selectedProtectedVault?.id
              }
              onPress={() => handleVaultClick(vault)}
            />
          ))}
        </VaultsList>
        <ExportFormat>
          <RadioSelect
            options={radioOptions}
            selectedOption={exportType}
            onChange={(value) => setExportType(value)}
            title={t`Choose the file format`}
          />
        </ExportFormat>
        <ExportButton>
          <ButtonSecondary
            disabled={!selectedVaults.length && !selectedProtectedVault}
            onPress={handleExport}
            size="sm"
          >
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
