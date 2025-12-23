import { Buffer } from 'buffer'

import { useRef, useState } from 'react'

import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { CameraView } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import {
  CommonFileIcon,
  DeleteIcon
} from 'pearpass-lib-ui-react-native-components'
import { Image } from 'react-native'

import {
  ActionsWrapper,
  CameraWrapper,
  DeleteIconWrapper,
  Header,
  PreviewWrapper,
  Title
} from './styles'
import { FileSizeWarning } from '../../components/FileSizeWarning'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { withAutoLockBypass } from '../../HOCs'
import { ButtonLittle, ButtonSecondary } from '../../libComponents'
import { validateBase64Size } from '../../utils/fileSize'
import { logger } from '../../utils/logger'

global.Buffer = global.Buffer || Buffer

/**
 * @component
 * @param {Object} props
 * @param {Function} props.onFileSelect
 */
export const BottomSheetUploadImageContent = withAutoLockBypass(
  ({ onFileSelect }) => {
    const { collapse } = useBottomSheet()
    const { t } = useLingui()
    const cameraRef = useRef(null)
    const [capturedPhoto, setCapturedPhoto] = useState(null)
    const [mode, setMode] = useState('camera')
    const [isFileSizeWarning, setIsFileSizeWarning] = useState(false)

    const handleChooseImage = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true
        })

        if (!result.canceled) {
          const file = result.assets[0]
          const validation = validateBase64Size(file.base64)
          if (!validation.valid) {
            setIsFileSizeWarning(true)
            return
          }

          if (isFileSizeWarning) {
            setIsFileSizeWarning(false)
          }

          onFileSelect?.({
            name: file.fileName,
            base64: file.base64
          })
          collapse()
        }
      } catch (e) {
        logger.error('Error picking image:', e)
      }
    }

    const handleTakePhoto = async () => {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true
          })

          setCapturedPhoto(photo)

          if (isFileSizeWarning) {
            setIsFileSizeWarning(false)
          }

          setMode('preview')
        } catch (e) {
          logger.error('Error taking photo:', e)
        }
      }
    }

    const handleImageSelect = () => {
      if (mode === 'preview' && capturedPhoto) {
        const validation = validateBase64Size(capturedPhoto.base64)
        if (!validation.valid) {
          setIsFileSizeWarning(true)
          return
        }

        onFileSelect?.({
          name: `photo-${Date.now()}.jpg`,
          base64: capturedPhoto.base64
        })

        collapse()
      }
    }

    return (
      <BottomSheetView style={{ padding: 20 }}>
        <Header>
          <CommonFileIcon />
          <Title>{t`Upload picture`}</Title>
        </Header>

        <CameraWrapper>
          {mode === 'preview' && capturedPhoto ? (
            <PreviewWrapper>
              <Image
                source={{ uri: capturedPhoto.uri }}
                style={{ flex: 1, borderRadius: 10 }}
                resizeMode="cover"
              />

              <DeleteIconWrapper>
                <ButtonLittle
                  startIcon={DeleteIcon}
                  variant="secondary"
                  borderRadius="md"
                  onPress={() => {
                    setCapturedPhoto(null)
                    setMode('camera')
                  }}
                />
              </DeleteIconWrapper>
            </PreviewWrapper>
          ) : (
            <CameraView
              style={{
                flex: 1,
                borderRadius: 10
              }}
              ratio="4:3"
              ref={cameraRef}
            />
          )}
        </CameraWrapper>

        <ActionsWrapper>
          <FileSizeWarning
            isFileSizeWarning={isFileSizeWarning}
            withMarginBottom={false}
          />
          {mode === 'preview' && capturedPhoto ? (
            <>
              <ButtonSecondary
                onPress={handleImageSelect}
                stretch
              >{t`Select`}</ButtonSecondary>
            </>
          ) : (
            <ButtonSecondary
              onPress={handleTakePhoto}
              stretch
              disabled={mode === 'preview'}
            >{t`Take Photo`}</ButtonSecondary>
          )}
          <ButtonSecondary
            onPress={handleChooseImage}
            stretch
          >{t`Choose from Library`}</ButtonSecondary>
        </ActionsWrapper>
      </BottomSheetView>
    )
  }
)
