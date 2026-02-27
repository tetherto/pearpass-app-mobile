import { useCallback, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { MAX_IMPORT_RECORDS } from 'pearpass-lib-constants'
import {
  parse1PasswordData,
  parseBitwardenData,
  parseKeePassData,
  parseLastPassData,
  parseNordPassData,
  parsePearPassData,
  parseProtonPassData
} from 'pearpass-lib-data-import'
import { BackIcon } from 'pearpass-lib-ui-react-native-components'
import {
  ButtonPrimary,
  ButtonSecondary
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { useCreateRecord } from 'pearpass-lib-vault'
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import {
  AcceptedFormats,
  Container as ImportContainer,
  Description,
  ImportOptionImage,
  ImportOptionItem,
  ImportOptionsList,
  SubTitle
} from './styles'
import { readFileContent } from './utils/readFileContent'
import { CardSingleSetting } from '../../../components/CardSingleSetting'
import { useAutoLockContext } from '../../../context/AutoLockContext'
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
  // {
  //   title: 'Encrypted file',
  //   type: 'encrypted',
  //   accepts: ['.json'],
  //   icon: LockIcon
  // },
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
  unencrypted: require('../../../../assets/images/VaultIcon.png')
}

export const ImportSection = () => {
  const { t } = useLingui()
  const { setShouldBypassAutoLock } = useAutoLockContext()
  const { createRecord } = useCreateRecord()

  const [kdbxPasswordModal, setKdbxPasswordModal] = useState({
    visible: false,
    fileBuffer: null,
    error: ''
  })
  const [kdbxPassword, setKdbxPassword] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)

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

  const handleKdbxUnlock = useCallback(async () => {
    if (!kdbxPassword || !kdbxPasswordModal.fileBuffer) return

    setIsUnlocking(true)
    setShouldBypassAutoLock(true)
    await new Promise((r) => setTimeout(r, 0))
    try {
      const result = await parseKeePassData(
        kdbxPasswordModal.fileBuffer,
        'kdbx',
        kdbxPassword
      )
      setKdbxPasswordModal({ visible: false, fileBuffer: null, error: '' })
      setKdbxPassword('')
      await importRecords(result)
    } catch (err) {
      if (err.message === 'Incorrect password') {
        setKdbxPasswordModal((prev) => ({
          ...prev,
          error: t`Incorrect password. Please try again.`
        }))
        setKdbxPassword('')
      } else {
        setKdbxPasswordModal({ visible: false, fileBuffer: null, error: '' })
        setKdbxPassword('')
        Toast.show({
          type: 'baseToast',
          text1: err.message,
          position: 'bottom',
          bottomOffset: 100
        })
        logger.error('KeePass KDBX import', err.message)
      }
    } finally {
      setIsUnlocking(false)
      setShouldBypassAutoLock(false)
    }
  }, [
    kdbxPassword,
    kdbxPasswordModal.fileBuffer,
    setShouldBypassAutoLock,
    importRecords,
    t
  ])

  const handleFileChange = async ({ type, accepts }) => {
    let result = []
    setShouldBypassAutoLock(true)

    try {
      const { fileContent, fileType } = await readFileContent(accepts)

      if (!isAllowedType(fileType, accepts)) {
        throw new Error('Invalid file type')
      }

      if (type === 'keepass' && fileType === 'kdbx') {
        setShouldBypassAutoLock(false)
        setKdbxPasswordModal({
          visible: true,
          fileBuffer: fileContent,
          error: ''
        })
        setKdbxPassword('')
        return
      }

      switch (type) {
        case '1password':
          result = await parse1PasswordData(fileContent, fileType)
          break
        case 'bitwarden':
          result = await parseBitwardenData(fileContent, fileType)
          break
        case 'keepass':
          result = await parseKeePassData(fileContent, fileType)
          break
        case 'lastpass':
          result = await parseLastPassData(fileContent, fileType)
          break
        case 'nordpass':
          result = await parseNordPassData(fileContent, fileType)
          break
        case 'protonpass':
          result = await parseProtonPassData(fileContent, fileType)
          break
        case 'unencrypted':
          result = await parsePearPassData(fileContent, fileType)
          break
        default:
          throw new Error(
            'Unsupported template type. Please select a valid import option.'
          )
      }

      await importRecords(result)
    } catch (error) {
      const isFileError = error.message?.includes('File too large')

      Toast.show({
        type: 'baseToast',
        text1: isFileError ? error.message : t`Vaults import failed!`,
        position: 'bottom',
        bottomOffset: 100
      })
      logger.error('Error importing:', error.message || error)
    } finally {
      setShouldBypassAutoLock(false)
    }
  }

  return (
    <CardSingleSetting title={t`Import Vault`}>
      <ImportContainer>
        <Description>
          {t`Move your saved items here from another password manager. They'll be added to this vault.`}
        </Description>
        <ImportOptionsList>
          {importOptions.map((option) => (
            <ImportOptionItem
              key={option.imgKey}
              onPress={() =>
                handleFileChange({
                  type: option.type,
                  accepts: option.accepts
                })
              }
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

      <Modal
        visible={kdbxPasswordModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setKdbxPasswordModal({ visible: false, fileBuffer: null, error: '' })
          setKdbxPassword('')
        }}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>{t`Enter KeePass Password`}</Text>
            <TextInput
              style={modalStyles.input}
              placeholder={t`Database password`}
              placeholderTextColor={colors.grey100.mode1}
              secureTextEntry
              autoFocus
              editable={!isUnlocking}
              value={kdbxPassword}
              onChangeText={setKdbxPassword}
              onSubmitEditing={handleKdbxUnlock}
            />
            {kdbxPasswordModal.error ? (
              <Text style={modalStyles.error}>{kdbxPasswordModal.error}</Text>
            ) : null}
            <View style={modalStyles.buttons}>
              {isUnlocking ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary400.mode1}
                />
              ) : (
                <>
                  <ButtonPrimary
                    onPress={handleKdbxUnlock}
                    disabled={!kdbxPassword}
                    stretch
                  >
                    {t`Unlock & Import`}
                  </ButtonPrimary>
                  <ButtonSecondary
                    onPress={() => {
                      setKdbxPasswordModal({
                        visible: false,
                        fileBuffer: null,
                        error: ''
                      })
                      setKdbxPassword('')
                    }}
                    stretch
                  >
                    {t`Cancel`}
                  </ButtonSecondary>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </CardSingleSetting>
  )
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  container: {
    width: '100%',
    backgroundColor: colors.grey400?.mode1 || '#1e1e1e',
    borderRadius: 16,
    padding: 24,
    gap: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey100.mode1,
    color: colors.white.mode1,
    fontSize: 14
  },
  error: {
    color: '#ff4d4f',
    fontSize: 12
  },
  buttons: {
    gap: 12
  }
})

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
