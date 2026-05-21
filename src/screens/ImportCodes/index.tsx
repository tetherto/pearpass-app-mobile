import { t } from '@lingui/core/macro'
import { useNavigation } from '@react-navigation/native'
import { MOBILE_2FA_IMPORTS_ENABLED } from '@tetherto/pearpass-lib-constants'
import {
  Button,
  Link,
  ListItem,
  rawTokens,
  Text,
  Title,
  UploadField,
  UploadedFile,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
  QrCode,
  UploadFileFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { useEffect, useState } from 'react'
import { Linking, Pressable, View } from 'react-native'
import { BottomSheetQrScannerContentV2 } from 'src/containers/BottomSheetQrScannerContent/BottomSheetQrScannerContentV2'
import { Layout } from 'src/containers/Layout'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { ScanResultsView } from './ScanResultsView'
import { styles } from './styles'
import { ImportCodesOptionType } from './types'
import type { ImportCodesOption, ImportCodesState } from './types'

const importCodesOptions: ImportCodesOption[] = [
  {
    title: 'Google Authenticator',
    type: ImportCodesOptionType.GoogleAuthenticator,
    description: t`To import your codes, open Google Authenticator, tap the menu, go to Transfer accounts, and select Export accounts. Once the export is complete, one or more QR codes will be generated that you can upload here.`,
    testId: 'import-codes-google-authenticator',
    accepts: ['.json', '.csv', '.jpg', '.png'],
    supportLink: 'https://support.google.com/accounts/answer/1066447'
  }
]

export const ImportCodes = () => {
  const navigation = useNavigation() as {
    navigate: (screen: string, params?: object) => void
    goBack: () => void
  }
  const { theme } = useTheme()

  const [state, setState] = useState<ImportCodesState>('default')
  const [selectedOption, setSelectedOption] =
    useState<ImportCodesOption | null>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  useEffect(() => {
    if (!MOBILE_2FA_IMPORTS_ENABLED) {
      navigation.goBack()
    }
  }, [navigation])

  if (!MOBILE_2FA_IMPORTS_ENABLED) return null

  const handleBack = () => {
    if (state === 'upload') {
      setState('default')
      setSelectedOption(null)
      setFiles([])
    } else {
      navigation.goBack()
    }
  }

  const handleFilePick = () => {
    setFiles([
      {
        file: null as unknown as File,
        name: 'codes.json',
        size: 1024,
        type: 'json'
      }
    ])
  }

  const handleQRScanned = (data: string) => {
    setFiles([
      {
        file: null as unknown as File,
        name: 'qr-scan.txt',
        size: data.length,
        type: 'txt'
      }
    ])
  }

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
  }

  const renderFooter = () => {
    if (state !== 'upload') return null

    if (files.length === 0) {
      return (
        <View style={{ gap: rawTokens.spacing12 }}>
          <BottomSheetQrScannerContentV2
            open={isScannerOpen}
            onOpenChange={setIsScannerOpen}
            title={t`Scan QR to import 2FA codes`}
            trigger={
              <Button
                iconBefore={<QrCode />}
                data-testid="import-codes-scan-qr-button"
              >
                {t`Scan QR Code`}
              </Button>
            }
            onScanned={handleQRScanned}
          />
          <Button
            variant="secondary"
            iconBefore={<UploadFileFilled />}
            onClick={handleFilePick}
            data-testid="import-codes-upload-file-button"
          >
            {t`Upload File`}
          </Button>
        </View>
      )
    }

    return (
      <Button
        onClick={navigation.goBack}
        data-testid="import-codes-import-button"
      >
        {t`Import Codes`}
      </Button>
    )
  }

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
              {t`To import data from another authenticator, first access the authenticator, export your data, and then upload the exported file into the designated field`}
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
              {importCodesOptions.map((option) => (
                <ListItem
                  platform="mobile"
                  title={option.title}
                  testID={option.testId}
                  subtitle={
                    t`Required Format:` +
                    ' ' +
                    option.accepts
                      .map((a) => a.replace('.', ''))
                      .join(', ')
                      .toUpperCase()
                  }
                  showDivider
                  onClick={() => {
                    setSelectedOption(option)
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
                  key={option.type}
                />
              ))}
            </View>
          </View>
        </View>
      )}

      {state === 'upload' && selectedOption && (
        <View style={styles.content}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            testID="import-codes-back-button"
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
                    data-testid="import-codes-support-link"
                  >
                    {t`Learn more about exporting codes from ${selectedOption.title}`}
                  </Link>
                  .
                </>
              )}
            </Text>
          </View>

          <UploadField
            files={files}
            onFilesChange={handleFilesChange}
            onPress={handleFilePick}
            uploadLinkText={t`Upload File`}
            uploadSuffixText={t`here`}
            formatsPrefix={t`Required Format:`}
            acceptedFormats={selectedOption.accepts}
            testID="import-codes-upload-field"
          />

          {files.length > 0 && <ScanResultsView />}
        </View>
      )}
    </Layout>
  )
}
