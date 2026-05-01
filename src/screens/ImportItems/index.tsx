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
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  View
} from 'react-native'
import Toast from 'react-native-toast-message'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { Layout } from 'src/containers/Layout'
import { useAutoLockContext } from 'src/context/AutoLockContext'
import { useHapticFeedback } from 'src/hooks/useHapticFeedback'
import { readFileContent } from '../Settings/TabImport/utils/readFileContent'
import { styles } from './styles'

type ImportState = 'default' | 'upload' | 'inputPassword'

type ImportOption = {
  title: string
  type: ImportOptionType
  description: string
  testId: string
  accepts: string[]
  imgKey: string
  supportLink?: string
}

type FileInfo = {
  fileContent: string | ArrayBuffer
  fileType: string
  filename: string
  size: number
  isEncrypted: boolean
}

enum ImportOptionType {
  OnePassword = '1password',
  Bitwarden = 'bitwarden',
  KeePass = 'keepass',
  KeePassKDBX = 'keepass-kdbx',
  LastPass = 'lastpass',
  NordPass = 'nordpass',
  ProtonPass = 'protonpass',
  Unencrypted = 'unencrypted',
  Encrypted = 'encrypted'
}

const importOptions: ImportOption[] = [
  {
    title: '1Password',
    type: ImportOptionType.OnePassword,
    description: t`To import data from 1Password, open the app, go to File > Export, and export your data as a CSV file. Once the export is complete, upload the file here.`,
    testId: 'settings-import-1password',
    accepts: ['.csv'],
    imgKey: '1password',
    supportLink: 'https://support.1password.com/export'
  },
  {
    title: 'Bitwarden',
    type: ImportOptionType.Bitwarden,
    description: t`To import data from Bitwarden, go to Tools > Export Vault in the web app, choose JSON or CSV format, and upload the exported file here.`,
    testId: 'settings-import-bitwarden',
    accepts: ['.json', '.csv'],
    imgKey: 'bitwarden',
    supportLink: 'https://bitwarden.com/help/export-your-data/'
  },
  {
    title: 'KeePass',
    type: ImportOptionType.KeePass,
    description: t`To import data from KeePass, open your database and export it via File > Export. KDBX files require your database password. Upload the exported file here.`,
    testId: 'settings-import-keepass',
    accepts: ['.kdbx', '.csv', '.xml'],
    imgKey: 'keepass',
    supportLink: 'https://keepass.info/help/base/importexport.html'
  },
  {
    title: 'KeePassXC',
    type: ImportOptionType.KeePassKDBX,
    description: t`To import data from KeePassXC, open your database and go to Database > Export to CSV or XML. Once done, upload the exported file here.`,
    testId: 'settings-import-keepassxc',
    accepts: ['.csv', '.xml'],
    imgKey: 'keepassxc',
    supportLink:
      'https://keepassxc.org/docs/KeePassXC_UserGuide#_exporting_databases'
  },
  {
    title: 'LastPass',
    type: ImportOptionType.LastPass,
    description: t`To import data from LastPass, go to Advanced Options > Export in your LastPass vault. Export as CSV and upload the file here.`,
    testId: 'settings-import-lastpass',
    accepts: ['.csv'],
    imgKey: 'lastpass',
    supportLink:
      'https://support.lastpass.com/s/document-item?language=en_US&bundleId=lastpass&topicId=LastPass/export-web-vault.html&_LANG=enus'
  },
  {
    title: 'NordPass',
    type: ImportOptionType.NordPass,
    description: t`To import data from NordPass, open the app, go to Settings > Import & Export, and export your data as CSV. Upload the exported file here.`,
    testId: 'settings-import-nordpass',
    accepts: ['.csv'],
    imgKey: 'nordpass',
    supportLink:
      'https://support.nordpass.com/hc/en-us/articles/360007646477-How-to-export-passwords-from-NordPass'
  },
  {
    title: 'Proton Pass',
    type: ImportOptionType.ProtonPass,
    description: t`To import data from Proton Pass, open the app, go to Settings, navigate to the Export tab, and choose your preferred export format. Once the export is complete, upload the file here.`,
    testId: 'settings-import-protonpass',
    accepts: ['.csv', '.json'],
    imgKey: 'protonpass',
    supportLink: 'https://proton.me/support/pass-export'
  },
  {
    title: 'Encrypted file',
    type: ImportOptionType.Encrypted,
    description: t`Upload a PearPass-encrypted JSON export file. You will need the password used to encrypt the file.`,
    testId: 'settings-import-encrypted',
    accepts: ['.json'],
    imgKey: 'encrypted',
    supportLink:
      'https://docs.pass.pears.com/how-to-guides/how-to-export-your-vault/'
  },
  {
    title: 'Unencrypted file',
    type: ImportOptionType.Unencrypted,
    description: t`Upload an unencrypted PearPass export file in JSON or CSV format.`,
    testId: 'settings-import-unencrypted',
    accepts: ['.json', '.csv'],
    imgKey: 'unencrypted',
    supportLink:
      'https://docs.pass.pears.com/how-to-guides/how-to-export-your-vault/'
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
  [ImportOptionType.OnePassword]: Image.resolveAssetSource(
    require('../../../assets/images/1password.png')
  ).uri,
  [ImportOptionType.Bitwarden]: Image.resolveAssetSource(
    require('../../../assets/images/BitWarden.jpg')
  ).uri,
  [ImportOptionType.KeePass]: Image.resolveAssetSource(
    require('../../../assets/images/KeePass.png')
  ).uri,
  [ImportOptionType.KeePassKDBX]: Image.resolveAssetSource(
    require('../../../assets/images/KeePassXC.png')
  ).uri,
  [ImportOptionType.LastPass]: Image.resolveAssetSource(
    require('../../../assets/images/LastPass.png')
  ).uri,
  [ImportOptionType.ProtonPass]: Image.resolveAssetSource(
    require('../../../assets/images/ProtonPass.png')
  ).uri,
  [ImportOptionType.NordPass]: Image.resolveAssetSource(
    require('../../../assets/images/NordPass.png')
  ).uri,
  [ImportOptionType.Unencrypted]: Image.resolveAssetSource(
    require('../../../assets/images/VaultIcon.png')
  ).uri,
  [ImportOptionType.Encrypted]: Image.resolveAssetSource(
    require('../../../assets/images/VaultIcon.png')
  ).uri
}

export const ImportItems = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { setShouldBypassAutoLock } = useAutoLockContext() as {
    setShouldBypassAutoLock: (value: boolean) => void
    [key: string]: unknown
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
          file: null as unknown as File,
          name: fileInfo.filename,
          size: fileInfo.size ?? 0,
          type: fileInfo.fileType
        }
      ])
    } catch (error: unknown) {
      const isFileError =
        error instanceof Error && error.message.includes('File too large')
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
    let result: unknown[] = []
    let dataToProcess: unknown = fileContent
    let resolvedType = type

    try {
      if (
        (resolvedType === ImportOptionType.KeePass ||
          resolvedType === ImportOptionType.KeePassKDBX) &&
        fileType === 'kdbx'
      ) {
        if (!password)
          throw new Error('Password is required for encrypted files')
        dataToProcess = await decryptKeePassKdbx(fileContent, password)
        resolvedType = ImportOptionType.KeePassKDBX
      }

      if (resolvedType === ImportOptionType.Encrypted) {
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
        case ImportOptionType.OnePassword:
          result = await parse1PasswordData(dataToProcess, fileType)
          break
        case ImportOptionType.Bitwarden:
          result = await parseBitwardenData(dataToProcess, fileType)
          break
        case ImportOptionType.LastPass:
          result = await parseLastPassData(dataToProcess, fileType)
          break
        case ImportOptionType.KeePass:
          result = await parseKeePassData(dataToProcess, fileType)
          break
        case ImportOptionType.KeePassKDBX:
          result = await parseKeePassData(dataToProcess, 'kdbx')
          break
        case ImportOptionType.NordPass:
          result = await parseNordPassData(dataToProcess, fileType)
          break
        case ImportOptionType.ProtonPass:
          result = await parseProtonPassData(dataToProcess, fileType)
          break
        case ImportOptionType.Unencrypted:
          result = await parsePearPassData(dataToProcess, fileType)
          break
        case ImportOptionType.Encrypted:
          result = await parsePearPassData(dataToProcess, 'json')
          break
        default:
          throw new Error(
            'Unsupported template type. Please select a valid import option.'
          )
      }

      await importRecords(result)
    } catch (error: unknown) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to parse file. Please ensure it is valid.'
      )
    }
  }

  const importRecords = useCallback(
    async (result: unknown[]) => {
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
        await Promise.all(batch.map((record: unknown) => createRecord(record)))
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
    } catch (error: unknown) {
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
          text1:
            error instanceof Error
              ? error.message
              : t`Import failed. Please try again.`,
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
          <Button
            iconBefore={<UploadFileFilled />}
            onClick={handleFilePick}
            data-testid="import-upload-file-button"
          >
            {t`Upload file`}
          </Button>
        )
      }
      return (
        <Button onClick={handleContinue} data-testid="import-continue-button">
          {t`Import`}
        </Button>
      )
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
          data-testid="import-submit-button"
        >
          {t`Import`}
        </Button>
      )
    }

    return null
  }

  const passwordField = register('password')

  return (
    <Layout
      scrollable
      header={
        <BackScreenHeader title={t`Settings`} onBack={navigation.goBack} />
      }
      contentStyle={styles.container}
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
                  testID={option.testId}
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
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            testID="import-back-button"
          >
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
              {selectedOption.description}
              {selectedOption.supportLink && (
                <>
                  {' '}
                  {t`Additionally,`}{' '}
                  <Link
                    href={selectedOption.supportLink}
                    isExternal
                    onClick={() => Linking.openURL(selectedOption.supportLink!)}
                    data-testid="import-support-link"
                  >
                    {t`learn more about exporting data from ${selectedOption.title}`}
                  </Link>
                  .
                </>
              )}
            </Text>
          </View>

          {state === 'inputPassword' ? (
            <View style={{ gap: rawTokens.spacing12 }}>
              <PasswordField
                label={t`File password`}
                placeholder={t`Enter file password`}
                value={passwordField.value}
                onChange={passwordField.onChange}
                error={passwordField.error ?? undefined}
                testID="import-file-password-field"
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
              testID="import-upload-field"
            />
          )}
        </View>
      )}
    </Layout>
  )
}
