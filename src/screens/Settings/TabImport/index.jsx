import { useCallback, useRef } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { MAX_IMPORT_RECORDS } from '@tetherto/pearpass-lib-constants'
import {
  decryptKeepassKdbx,
  parse1PasswordData,
  parseBitwardenData,
  parseKeePassData,
  parseLastPassData,
  parseNordPassData,
  parsePearPassData,
  parseProtonPassData
} from '@tetherto/pearpass-lib-data-import'
import { BackIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import {
  decryptExportData,
  useCreateRecord
} from '@tetherto/pearpass-lib-vault'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import {
  AcceptedFormats,
  Description,
  Container as ImportContainer,
  ImportOptionImage,
  ImportOptionItem,
  ImportOptionsList,
  SubTitle
} from './styles'
import { readFileContent } from './utils/readFileContent'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { BottomSheetImportVaultContent } from '../../../containers/BottomSheetImportVaultContent'
import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useHapticFeedback } from '../../../hooks/useHapticFeedback'
import { ButtonLittle } from '../../../libComponents'
import { logger } from '../../../utils/logger'
import { settingsStyles } from '../styles'

const importOptions = [
  {
    title: '1Password',
    type: '1password',
    accepts: ['.csv'],
    imgKey: '1password'
  },
  {
    title: 'Bitwarden',
    type: 'bitwarden',
    accepts: ['.json', '.csv'],
    imgKey: 'bitwarden'
  },
  {
    title: 'KeePass',
    type: 'keepass',
    accepts: ['.kdbx', '.csv', '.xml'],
    imgKey: 'keepass'
  },
  {
    title: 'KeePassXC',
    type: 'keepass',
    accepts: ['.csv', '.xml'],
    imgKey: 'keepassxc'
  },
  {
    title: 'LastPass',
    type: 'lastpass',
    accepts: ['.csv'],
    imgKey: 'lastpass'
  },
  {
    title: 'NordPass',
    type: 'nordpass',
    accepts: ['.csv'],
    imgKey: 'nordpass'
  },
  {
    title: 'Proton Pass',
    type: 'protonpass',
    accepts: ['.csv', '.json'],
    imgKey: 'protonpass'
  },
  {
    title: 'Encrypted file',
    type: 'encrypted',
    accepts: ['.json'],
    imgKey: 'encrypted'
  },
  {
    title: 'Unencrypted file',
    type: 'unencrypted',
    accepts: ['.json', '.csv'],
    imgKey: 'unencrypted'
  }
]

const isAllowedType = (fileType, accepts) =>
  accepts.some((accept) => {
    if (accept.startsWith('.')) {
      return fileType === accept.slice(1)
    }
    return fileType === accept
  })

const images = {
  '1password': require('../../../../assets/images/1password.png'),
  bitwarden: require('../../../../assets/images/BitWarden.png'),
  keepass: require('../../../../assets/images/KeePass.png'),
  keepassxc: require('../../../../assets/images/KeePassXC.png'),
  lastpass: require('../../../../assets/images/LastPass.png'),
  protonpass: require('../../../../assets/images/ProtonPass.png'),
  nordpass: require('../../../../assets/images/NordPass.png'),
  unencrypted: require('../../../../assets/images/VaultIcon.png'),
  encrypted: require('../../../../assets/images/VaultIcon.png')
}

export const ImportSection = () => {
  const { t } = useLingui()
  const { setShouldBypassAutoLock } = useAutoLockContext()
  const { createRecord } = useCreateRecord()
  const { expand, collapse } = useBottomSheet()
  const currentOptionRef = useRef(null)
  const { hapticButtonSecondary } = useHapticFeedback()

  const getSnapPointsForStep = useCallback((step) => {
    switch (step) {
      case 0:
        return ['10%', '25%']
      case 1:
        return ['20%', '35%']
      case 2:
        return ['10%', '35%']
      default:
        return ['10%', '40%']
    }
  }, [])

  const handleStepChange = useCallback(
    (step) => {
      if (currentOptionRef.current) {
        expand({
          ...currentOptionRef.current,
          snapPoints: getSnapPointsForStep(step)
        })
      }
    },
    [expand, getSnapPointsForStep]
  )

  const handleFileChange = async ({ accepts }) => {
    hapticButtonSecondary()
    setShouldBypassAutoLock(true)
    try {
      const fileInfo = await readFileContent(accepts)
      if (!isAllowedType(fileInfo.fileType, accepts)) {
        throw new Error('Invalid file type')
      }

      return fileInfo
    } catch (error) {
      const isFileError = error.message?.includes('File too large')

      Toast.show({
        type: 'baseToast',
        text1: isFileError ? error.message : t`File selection failed!`,
        position: 'bottom',
        bottomOffset: 100
      })
      logger.error('Error selecting file:', error.message || error)
      throw error
    } finally {
      setShouldBypassAutoLock(false)
    }
  }

  const onImport = async ({
    type,
    fileContent,
    fileType,
    password,
    isEncrypted
  }) => {
    let result = []
    let dataToProcess = fileContent

    try {
      if (type === 'keepass' && fileType === 'kdbx') {
        if (!password) {
          throw new Error('Password is required for encrypted files')
        }

        dataToProcess = await decryptKeepassKdbx(fileContent, password)
        type = 'keepass-kdbx'
      }

      if (type === 'encrypted' || isEncrypted) {
        if (!password) {
          throw new Error('Password is required for encrypted files')
        }

        const encryptedData = JSON.parse(fileContent)
        dataToProcess = await decryptExportData(encryptedData, password)
      }
    } catch {
      throw new Error(
        'Failed to decrypt file. Please check your password and try again.'
      )
    }

    try {
      switch (type) {
        case '1password':
          result = await parse1PasswordData(dataToProcess, fileType)
          break
        case 'bitwarden':
          result = await parseBitwardenData(dataToProcess, fileType)
          break
        case 'lastpass':
          result = await parseLastPassData(dataToProcess, fileType)
          break
        case 'keepass':
          result = await parseKeePassData(dataToProcess, fileType)
          break
        case 'keepass-kdbx':
          result = await parseKeePassData(dataToProcess, 'kdbx')
          break
        case 'nordpass':
          result = await parseNordPassData(dataToProcess, fileType)
          break
        case 'protonpass':
          result = await parseProtonPassData(dataToProcess, fileType)
          break
        case 'unencrypted':
          result = await parsePearPassData(dataToProcess, fileType)
          break
        case 'encrypted':
          result = await parsePearPassData(dataToProcess, 'json')
          break
        default:
          throw new Error(
            'Unsupported template type. Please select a valid import option.'
          )
      }

      await importRecords(result)
    } catch (error) {
      throw new Error(
        error.message || 'Failed to parse file. Please ensure it is valid.'
      )
    }
  }

  const importRecords = useCallback(
    async (result) => {
      if (result.length === 0) {
        Toast.show({
          type: 'baseToast',
          text1: t`No records found to import!`,
          position: 'bottom',
          bottomOffset: 100
        })
        return
      }

      if (result.length > MAX_IMPORT_RECORDS) {
        Toast.show({
          type: 'baseToast',
          text1: t`Too many records. Maximum is ${MAX_IMPORT_RECORDS}.`,
          position: 'bottom',
          bottomOffset: 100
        })
        return
      }

      const BATCH_SIZE = 100
      const totalRecords = result.length
      let importedCount = 0

      for (let i = 0; i < totalRecords; i += BATCH_SIZE) {
        const batch = result.slice(i, i + BATCH_SIZE)
        await Promise.all(batch.map((record) => createRecord(record)))

        importedCount += batch.length
        const progress = Math.round((importedCount / totalRecords) * 100)

        Toast.show({
          type: 'baseToast',
          text1: t`Importing... ${importedCount}/${totalRecords} (${progress}%)`,
          position: 'bottom',
          bottomOffset: 100
        })
      }

      Toast.show({
        type: 'baseToast',
        text1: t`Vaults imported successfully!`,
        position: 'bottom',
        bottomOffset: 100
      })
    },
    [createRecord, t]
  )

  return (
    <CardSingleSetting title={t`Import Vault`}>
      <ImportContainer>
        <Description>
          {t`Move your saved items here from another password manager. They'll be added to this vault.`}
        </Description>
        <ImportOptionsList>
          {importOptions.map((option) => (
            <ImportOptionItem
              key={option.title}
              onPress={() => {
                const bottomSheetOptions = {
                  children: (
                    <BottomSheetImportVaultContent
                      passwordManagerName={
                        option.title === 'Encrypted file' ||
                        option.title === 'Unencrypted file'
                          ? 'PearPass'
                          : option.title
                      }
                      onClose={collapse}
                      onBrowseFolder={async () =>
                        handleFileChange({
                          accepts: option.accepts
                        })
                      }
                      onImport={async ({ fileContent, fileType }, password) =>
                        await onImport({
                          type: option.type,
                          fileContent,
                          fileType,
                          password
                        })
                      }
                      onStepChange={handleStepChange}
                    />
                  ),
                  snapPoints: getSnapPointsForStep(0)
                }
                currentOptionRef.current = bottomSheetOptions
                expand(bottomSheetOptions)
              }}
            >
              {option.imgKey ? (
                <ImportOptionImage source={images[option.imgKey]} />
              ) : (
                <option.icon width={32} height={32} />
              )}
              <SubTitle>{option.title}</SubTitle>
              <AcceptedFormats>{option.accepts.join(', ')}</AcceptedFormats>
            </ImportOptionItem>
          ))}
        </ImportOptionsList>
      </ImportContainer>
    </CardSingleSetting>
  )
}

export const TabImport = () => {
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
        <Text style={settingsStyles.screenTitle}>{t`Import`}</Text>
      </View>
      <ScrollView contentContainerStyle={settingsStyles.contentContainer}>
        <ImportSection />
      </ScrollView>
    </SafeAreaView>
  )
}
