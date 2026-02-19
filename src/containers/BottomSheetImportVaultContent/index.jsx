import { useEffect, useState } from 'react'

import { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { useForm } from 'pear-apps-lib-ui-react-hooks'
import { Validator } from 'pear-apps-utils-validator'
import {
  ButtonPrimary,
  CommonFileIcon,
  DeleteIcon,
  FolderIcon
} from 'pearpass-lib-ui-react-native-components'
import { colors } from 'pearpass-lib-ui-theme-provider'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import Toast from 'react-native-toast-message'

import { InputPasswordPearPass } from '../../libComponents/InputPasswordPearPass'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const STEPS = {
  BROWSE: 0,
  FILE_SELECTED: 1,
  PASSWORD_ENTRY: 2
}

/**
 * @component
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} props.onBrowseFolder
 * @param {Function} props.onImport
 * @param {Function} props.onStepChange
 * @param {string} props.passwordManagerName
 */
export const BottomSheetImportVaultContent = ({
  onClose,
  onBrowseFolder,
  onImport,
  onStepChange,
  passwordManagerName = 'PearPass'
}) => {
  const { t } = useLingui()
  const [currentStep, setCurrentStep] = useState(STEPS.BROWSE)
  const [selectedFile, setSelectedFile] = useState(null)
  const slideAnim = useSharedValue(0)

  const schema = Validator.object({
    password: Validator.string().required(t`Password is required`)
  })

  const { register, handleSubmit, setErrors, values } = useForm({
    initialValues: {
      password: ''
    },
    validate: (values) => schema.validate(values)
  })

  useEffect(() => {
    slideAnim.value = withTiming(currentStep, {
      duration: 300
    })
    onStepChange?.(currentStep)
  }, [currentStep, slideAnim, onStepChange])

  const handleBrowse = async () => {
    try {
      const fileInfo = await onBrowseFolder()
      setSelectedFile(fileInfo)
      setCurrentStep(STEPS.FILE_SELECTED)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t`Failed to select file`,
        text2:
          error.message ||
          t`An error occurred while selecting your file. Please try again.`,
        position: 'bottom',
        bottomOffset: 100
      })
    }
  }

  const handleContinue = () => {
    if (selectedFile?.isEncrypted) {
      setCurrentStep(STEPS.PASSWORD_ENTRY)
    } else {
      handleImport()
    }
  }

  const handleImport = async (formValues) => {
    try {
      const password = formValues?.password || null
      await onImport(
        {
          fileContent: selectedFile.fileContent,
          fileType: selectedFile.fileType,
          isEncrypted: selectedFile.isEncrypted
        },
        password
      )
      onClose()
    } catch (error) {
      if (currentStep === STEPS.PASSWORD_ENTRY) {
        setErrors({
          password:
            typeof error === 'string'
              ? error
              : t`The password entered doesn't match the one used to encrypt your file. Please check your credentials and try again.`
        })
      }
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setCurrentStep(STEPS.BROWSE)
  }

  const renderBrowseStep = () => (
    <>
      <Text style={styles.title}>{t`Import Vault`}</Text>

      <Text style={styles.description}>
        {t`Drop here the ${passwordManagerName} file`}
      </Text>

      <View style={styles.fullWidth}>
        <Text style={styles.fileSize}>{t`Maximum file size: 6 MB.`}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonPrimary startIcon={FolderIcon} onPress={handleBrowse} stretch>
          {t`Browse Folder`}
        </ButtonPrimary>
      </View>
    </>
  )

  const renderFileSelectedStep = () => (
    <>
      <Text style={styles.title}>{t`Import Vault`}</Text>

      <Text style={styles.description}>
        {t`Import selected file or choose another one if you want to import a different vault.`}
      </Text>

      <View style={styles.fileCard}>
        <View style={styles.fileInfo}>
          <CommonFileIcon color={colors.white.mode1} width={24} height={24} />
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>{selectedFile?.filename}</Text>
          </View>
        </View>
        <Pressable onPress={handleRemoveFile} style={styles.removeButton}>
          <DeleteIcon color={colors.grey100.mode1} width={20} height={20} />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonPrimary onPress={handleContinue} stretch>
          {selectedFile?.isEncrypted ? t`Continue` : t`Import`}
        </ButtonPrimary>
      </View>
    </>
  )

  const renderPasswordStep = () => (
    <>
      <Text style={styles.title}>{t`Import Vault`}</Text>

      <Text style={styles.description}>
        {t`To decrypt and import your data, please enter the file's password below.`}
      </Text>

      <View style={styles.fullWidth}>
        <InputPasswordPearPass
          placeholder={t`Enter your password`}
          isPassword
          as={BottomSheetTextInput}
          testID="import-vault-password-input"
          {...register('password')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonPrimary
          disabled={!values.password}
          onPress={handleSubmit(handleImport)}
          stretch
        >
          {t`Import`}
        </ButtonPrimary>
      </View>
    </>
  )

  const browseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -slideAnim.value * (SCREEN_WIDTH - 40) }]
  }))

  const fileSelectedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - slideAnim.value) * (SCREEN_WIDTH - 40) }]
  }))

  const passwordAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (2 - slideAnim.value) * (SCREEN_WIDTH - 40) }]
  }))

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.stepsContainer}>
        <Animated.View style={[styles.stepWrapper, browseAnimatedStyle]}>
          {renderBrowseStep()}
        </Animated.View>

        <Animated.View style={[styles.stepWrapper, fileSelectedAnimatedStyle]}>
          {renderFileSelectedStep()}
        </Animated.View>

        <Animated.View style={[styles.stepWrapper, passwordAnimatedStyle]}>
          {renderPasswordStep()}
        </Animated.View>
      </View>
    </BottomSheetView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    overflow: 'hidden'
  },
  stepsContainer: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 400
  },
  stepWrapper: {
    width: SCREEN_WIDTH - 40,
    gap: 25,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0
  },
  wrapper: {
    gap: 25,
    alignItems: 'center'
  },
  fullWidth: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white.mode1,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.grey100.mode1,
    textAlign: 'center',
    lineHeight: 20
  },
  fileSize: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.grey100.mode1,
    textAlign: 'center',
    lineHeight: 18
  },
  buttonContainer: {
    width: '100%',
    gap: 15
  },
  fileCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grey400.mode1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey300.mode1
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  fileDetails: {
    flex: 1,
    gap: 4
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white.mode1
  },
  fileDate: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.grey100.mode1
  },
  removeButton: {
    padding: 4
  }
})
