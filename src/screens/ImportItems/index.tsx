import { t } from '@lingui/core/macro'
import { useNavigation } from '@react-navigation/native'
import { useForm } from '@tetherto/pear-apps-lib-ui-react-hooks'
import { Validator } from '@tetherto/pear-apps-utils-validator'
import { MAX_IMPORT_RECORDS } from '@tetherto/pearpass-lib-constants'
import {
  decryptKeePassKdbx,
  parse1PasswordData,
  parseBitwardenData,
  parseKeePassData,
  parseLastPassData,
  parseNordPassData,
  parsePearPassData,
  parseProtonPassData
} from '@tetherto/pearpass-lib-data-import'
import {
  Button,
  Link,
  ListItem,
  PasswordField,
  rawTokens,
  Text,
  Title,
  UploadedFile,
  UploadField,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
  UploadFileFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import {
  decryptExportData,
  useCreateRecord
} from '@tetherto/pearpass-lib-vault'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Image, Pressable, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScreenLayout } from 'src/containers/ScreenLayout'
import { useAutoLockContext } from 'src/context/AutoLockContext'
import { useHapticFeedback } from 'src/hooks/useHapticFeedback'
import { readFileContent } from '../Settings/TabImport/utils/readFileContent'
import { styles } from './styles'

type ImportState = 'default' | 'upload' | 'inputPassword'

type ImportOption = {
  title: string
  type: string
  accepts: string[]
  imgKey: string
}

type FileInfo = {
  fileContent: string | ArrayBuffer
  fileType: string
  filename: string
  size: number
  isEncrypted: boolean
}

const importOptions: ImportOption[] = [
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

const isAllowedType = (fileType: string, accepts: string[]) =>
  accepts.some((accept) => {
    if (accept.startsWith('.')) {
      return fileType === accept.slice(1)
    }
    return fileType === accept
  })

const images = {
  '1password': Image.resolveAssetSource(
    require('../../../assets/images/1password.png')
  ).uri,
  bitwarden: Image.resolveAssetSource(
    require('../../../assets/images/BitWarden.png')
  ).uri,
  keepass: Image.resolveAssetSource(
    require('../../../assets/images/KeePass.png')
  ).uri,
  keepassxc: Image.resolveAssetSource(
    require('../../../assets/images/KeePassXC.png')
  ).uri,
  lastpass: Image.resolveAssetSource(
    require('../../../assets/images/LastPass.png')
  ).uri,
  protonpass: Image.resolveAssetSource(
    require('../../../assets/images/ProtonPass.png')
  ).uri,
  nordpass: Image.resolveAssetSource(
    require('../../../assets/images/NordPass.png')
  ).uri,
  unencrypted: Image.resolveAssetSource(
    require('../../../assets/images/VaultIcon.png')
  ).uri,
  encrypted: Image.resolveAssetSource(
    require('../../../assets/images/VaultIcon.png')
  ).uri
}

export const ImportItems = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { setShouldBypassAutoLock } = useAutoLockContext() as {
    setShouldBypassAutoLock: (value: boolean) => void
    [key: string]: any
  }
  const { createRecord } = useCreateRecord()
  const { hapticButtonSecondary } = useHapticFeedback()

  const [state, setState] = useState<ImportState>('default')
  const [selectedOption, setSelectedOption] = useState<ImportOption | null>(
    null
  )
  const [selectedFileInfo, setSelectedFileInfo] = useState<FileInfo | null>(
    null
  )
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors, values, setValues } = useForm({
    initialValues: { password: '' },
    validate: (vals: { password: string }) => schema.validate(vals)
  })

  const handleBack = () => {
    if (state === 'inputPassword') {
      setState('upload')
      setValues({ password: '' })
    } else if (state === 'upload') {
      setState('default')
      setSelectedOption(null)
      setSelectedFileInfo(null)
      setFiles([])
    } else {
      navigation.goBack()
    }
  }

  const handleFilePick = async () => {
    if (!selectedOption) return
    hapticButtonSecondary()
    setShouldBypassAutoLock(true)
    try {
      const fileInfo = await readFileContent(selectedOption.accepts)
      if (!isAllowedType(fileInfo.fileType, selectedOption.accepts)) {
        throw new Error('Invalid file type')
      }
      setSelectedFileInfo({ ...fileInfo, size: fileInfo.size ?? 0 })
      setFiles([
        {
          file: null as any,
          name: fileInfo.filename,
          size: fileInfo.size ?? 0,
          type: fileInfo.fileType
        }
      ])
    } catch (error: any) {
      const isFileError = error.message?.includes('File too large')
      Toast.show({
        type: 'baseToast',
        text1: isFileError ? error.message : t`File selection failed!`,
        position: 'bottom',
        bottomOffset: 100
      })
    } finally {
      setShouldBypassAutoLock(false)
    }
  }

  const onImport = async ({
    type,
    fileContent,
    fileType,
    password
  }: {
    type: string
    fileContent: string | ArrayBuffer
    fileType: string
    password: string | null
  }) => {
    let result: any[] = []
    let dataToProcess: any = fileContent
    let resolvedType = type

    try {
      if (resolvedType === 'keepass' && fileType === 'kdbx') {
        if (!password)
          throw new Error('Password is required for encrypted files')
        dataToProcess = await decryptKeePassKdbx(fileContent, password)
        resolvedType = 'keepass-kdbx'
      }

      if (resolvedType === 'encrypted') {
        if (!password)
          throw new Error('Password is required for encrypted files')
        const encryptedData = JSON.parse(fileContent as string)
        dataToProcess = await decryptExportData(encryptedData, password)
      }
    } catch {
      throw new Error(
        'Failed to decrypt file. Please check your password and try again.'
      )
    }

    try {
      switch (resolvedType) {
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
    } catch (error: any) {
      throw new Error(
        error.message || 'Failed to parse file. Please ensure it is valid.'
      )
    }
  }

  const importRecords = useCallback(
    async (result: any[]) => {
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
        await Promise.all(batch.map((record: any) => createRecord(record)))
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
    [createRecord]
  )

  const handleImport = async (formValues?: { password: string }) => {
    if (!selectedOption || !selectedFileInfo) return
    setIsImporting(true)
    await new Promise((resolve) => setTimeout(resolve, 0))
    try {
      const password = formValues?.password || null
      await onImport({
        type: selectedOption.type,
        fileContent: selectedFileInfo.fileContent,
        fileType: selectedFileInfo.fileType,
        password
      })
      navigation.goBack()
    } catch (error: any) {
      if (state === 'inputPassword') {
        setErrors({
          password:
            typeof error === 'string'
              ? error
              : t`The password entered doesn't match the one used to encrypt your file. Please check your credentials and try again.`
        })
      } else {
        Toast.show({
          type: 'baseToast',
          text1: error.message || t`Import failed. Please try again.`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    } finally {
      setIsImporting(false)
    }
  }

  const handleContinue = () => {
    const needsPassword =
      selectedFileInfo?.isEncrypted || selectedOption?.type === 'encrypted'
    if (needsPassword) {
      setState('inputPassword')
    } else {
      handleImport()
    }
  }

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    if (newFiles.length === 0) {
      setSelectedFileInfo(null)
    }
  }

  const renderFooter = () => {
    if (state === 'default') return null

    if (state === 'upload') {
      if (!selectedFileInfo) {
        return (
          <Button iconBefore={<UploadFileFilled />} onClick={handleFilePick}>
            {t`Upload file`}
          </Button>
        )
      }
      return <Button onClick={handleContinue}>{t`Import`}</Button>
    }

    if (state === 'inputPassword') {
      if (isImporting) {
        return (
          <ActivityIndicator size="small" color={theme.colors.colorPrimary} />
        )
      }
      return (
        <Button
          disabled={!values.password}
          onClick={handleSubmit(handleImport)}
        >
          {t`Import`}
        </Button>
      )
    }

    return null
  }

  const passwordField = register('password')

  return (
    <ScreenLayout
      scrollable
      header={
        <BackScreenHeader title={t`Settings`} onBack={navigation.goBack} />
      }
      footer={renderFooter()}
    >
      {state === 'default' && (
        <View style={styles.content}>
          <View style={styles.captions}>
            <Title>{t`Import`}</Title>
            <Text color={theme.colors.colorTextSecondary} variant="label">
              {t`To import data from another password manager, first access the password manager, export your data, and then upload the exported file into the designated field`}
            </Text>
          </View>
          <View style={styles.importWrapper}>
            <Text color={theme.colors.colorTextSecondary} variant="caption">
              {t`Select Import Source`}
            </Text>
            <View
              style={[
                styles.listWrapper,
                { borderColor: theme.colors.colorSurfaceDisabled }
              ]}
            >
              {importOptions.map((option) => (
                <ListItem
                  platform="mobile"
                  title={option.title}
                  subtitle={
                    t`Required Format:` +
                    ' ' +
                    option.accepts.join(', ').toUpperCase()
                  }
                  showDivider
                  onClick={() => {
                    setSelectedOption(option)
                    setSelectedFileInfo(null)
                    setFiles([])
                    setState('upload')
                  }}
                  rightElement={
                    <KeyboardArrowRightOutlined
                      width={16}
                      height={16}
                      color={theme.colors.colorTextPrimary}
                    />
                  }
                  icon={
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: rawTokens.radius8,
                        overflow: 'hidden',
                        backgroundColor: theme.colors.colorSurfaceHover,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        source={{
                          uri: images[option.imgKey as keyof typeof images]
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: rawTokens.radius8
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  }
                  key={option.title}
                />
              ))}
            </View>
          </View>
        </View>
      )}

      {state !== 'default' && selectedOption && (
        <View style={styles.content}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <KeyboardArrowLeftOutlined
              width={20}
              height={20}
              color={theme.colors.colorTextPrimary}
            />
            <Text color={theme.colors.colorTextPrimary}>{t`Back`}</Text>
          </Pressable>
          <View style={styles.captions}>
            <Title>
              {t`Import from`} {selectedOption.title}
            </Title>
            <Text color={theme.colors.colorTextSecondary} variant="label">
              {t`To import data from Proton Pass, open the app, go to Settings, navigate to the Export tab, and choose your preferred export format. Once the export is complete, upload the file here.`}{' '}
              <Link>
                {t`Additionally, learn more about exporting data from Proton Pass.`}
              </Link>
            </Text>
          </View>

          {state === 'inputPassword' ? (
            <View style={{ gap: rawTokens.spacing12 }}>
              <PasswordField
                label={t`File password`}
                placeholderText={t`Enter file password`}
                value={passwordField.value}
                onChangeText={passwordField.onChange}
                errorMessage={passwordField.error}
              />
              <Text color={theme.colors.colorTextSecondary} variant="caption">
                {t`The Uploaded File is encrypted, put the Password file to continue`}
              </Text>
            </View>
          ) : (
            <UploadField
              files={files}
              onFilesChange={handleFilesChange}
              onPress={handleFilePick}
              uploadLinkText={t`Upload file`}
              uploadSuffixText={t`here`}
              formatsPrefix={t`Required formats:`}
              acceptedFormats={selectedOption.accepts}
              image={images[selectedOption.imgKey as keyof typeof images]}
            />
          )}
        </View>
      )}
    </ScreenLayout>
  )
}
