import { useMemo, useCallback, memo } from 'react'

import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import {
  ImageIcon,
  PlusIcon
} from '@tetherto/pearpass-lib-ui-react-native-components'
import { colors } from '@tetherto/pearpass-lib-ui-theme-provider'
import { Alert, Pressable, Linking } from 'react-native'
import { Camera } from 'react-native-vision-camera'

import {
  AddContainer,
  Body,
  Container,
  Header,
  ImageContainer,
  Photo,
  Title
} from './styles'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { logger } from '../../utils/logger'
import { BottomSheetUploadImageContent } from '../BottomSheetUploadImageContent'

/**
 * @component
 * @param {Object} props
 * @param {string} props.title
 * @param {Array<Object>} [props.pictures=[]]
 * @param {function} [props.onAdd]
 * @param {function} [props.onRemove]
 * @param {function} [props.onRename]
 * @param {string} [props.testID]
 * @param {string} [props.accessibilityLabel]
 * @param {string} [props.addButtonTestID]
 * @param {string} [props.addButtonAccessibilityLabel]
 */
const ImagesFieldComponent = ({
  title,
  pictures = [],
  onAdd,
  onRemove,
  onRename,
  testID,
  accessibilityLabel,
  addButtonTestID,
  addButtonAccessibilityLabel
}) => {
  const { expand } = useBottomSheet()
  const navigation = useNavigation()
  const { t } = useLingui()
  const { setShouldBypassAutoLock } = useAutoLockContext()

  // Memoize URIs to avoid recreating them on every render
  const picturesWithUris = useMemo(
    () =>
      pictures?.map((picture, index) => ({
        ...picture,
        uri: picture.base64
          ? `data:image/jpeg;base64,${picture.base64}`
          : undefined,
        // Use a stable key: id if available, otherwise name, fallback to index
        key: picture.id || picture.name || `picture-${index}`
      })) || [],
    [pictures]
  )

  const handlePictureClick = useCallback(
    (uri, name, index) => {
      navigation.navigate('ImagePreview', {
        imageUri: uri,
        imageName: name,
        onDelete: onRemove ? () => onRemove(index) : undefined,
        onRename: onRename ? (newName) => onRename(index, newName) : undefined
      })
    },
    [navigation, onRemove, onRename]
  )

  const handleAddClick = useCallback(async () => {
    try {
      setShouldBypassAutoLock(true)
      const cameraStatus = Camera.getCameraPermissionStatus()
      let cameraGranted = cameraStatus === 'granted'

      if (!cameraGranted && cameraStatus === 'not-determined') {
        const result = await Camera.requestCameraPermission()
        cameraGranted = result === 'granted'
      }

      if (!cameraGranted) {
        Alert.alert(
          t`Permission Required`,
          t`Camera access is required to take photos. Please enable it in Settings.`,
          [
            { text: t`Cancel`, style: 'cancel' },
            {
              text: t`Open Settings`,
              onPress: () => Linking.openSettings()
            }
          ]
        )
        return
      }
      expand({
        children: <BottomSheetUploadImageContent onFileSelect={onAdd} />,
        snapPoints: ['65%', '65%', '80%']
      })
    } catch (error) {
      logger.error('Error checking permissions:', error)
      Alert.alert(t`Error`, t`Failed to check permissions. Please try again.`)
    } finally {
      setShouldBypassAutoLock(false)
    }
  }, [expand, onAdd, t])

  return (
    <Container testID={testID} accessibilityLabel={accessibilityLabel}>
      <Header>
        <ImageIcon />
        <Title>{title}</Title>
      </Header>

      <Body>
        {picturesWithUris.map((picture, idx) => (
          <Pressable
            key={`picture.key-${idx}`}
            onPress={() => handlePictureClick(picture.uri, picture.name, idx)}
          >
            <ImageContainer>
              <Photo source={{ uri: picture.uri }} resizeMode="cover" />
            </ImageContainer>
          </Pressable>
        ))}

        {onAdd && (
          <AddContainer
            onPress={handleAddClick}
            testID={addButtonTestID}
            accessibilityLabel={addButtonAccessibilityLabel}
          >
            <PlusIcon color={colors.primary400.mode1} />
          </AddContainer>
        )}
      </Body>
    </Container>
  )
}

ImagesFieldComponent.displayName = 'ImagesField'

export const ImagesField = memo(ImagesFieldComponent)
