import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'

import { Button, useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { Share as ShareIcon } from '@tetherto/pearpass-lib-ui-kit/icons'
import { shareAsync } from 'expo-sharing'
import { useState } from 'react'
import {
  Image,
  Platform,
  Share,
  View,
  type ImageLoadEventData,
  type NativeSyntheticEvent
} from 'react-native'
import Toast from 'react-native-toast-message'

import { BottomSheetFileMoreActionsContent } from 'src/containers/BottomSheetFileMoreActionsContent'
import { BackScreenHeader } from 'src/containers/ScreenHeader/BackScreenHeader'
import { Layout } from 'src/containers/Layout'
import { withAutoLockBypass } from '../../HOCs'
import { convertDataUriToFileUri } from '../../utils/convertDataUriToFileUri'
import { getMimeType } from '../../utils/getMimeType'
import { styles } from './styles'

interface ImagePreviewRouteParams {
  imageUri: string
  imageName?: string
  onDelete?: () => void
  onRename?: (newName: string) => void
}

export const ImagePreview = withAutoLockBypass(
  ({ route }: { route: { params: ImagePreviewRouteParams } }) => {
    const { t } = useLingui()
    const navigation = useNavigation()
    const { theme } = useTheme()
    const { imageUri, imageName, onDelete, onRename } = route.params
    const [currentImageName, setCurrentImageName] = useState(imageName)
    const [imageRatio, setImageRatio] = useState<number | null>(null)

    const isEditable = Boolean(onDelete || onRename)

    const handleImageLoad = (
      event: NativeSyntheticEvent<ImageLoadEventData>
    ) => {
      const { width, height } = event.nativeEvent.source
      if (width && height) {
        setImageRatio(width / height)
      }
    }

    const handleDelete = () => {
      if (onDelete) {
        onDelete()
      }
      navigation.goBack()
    }

    const handleRename = (newName: string) => {
      if (onRename) {
        onRename(newName)
        setCurrentImageName(newName)
      }
    }

    const handleShare = async () => {
      try {
        let fileUri: string | null = null

        if (imageUri?.startsWith('data:')) {
          fileUri = await convertDataUriToFileUri(
            imageUri,
            currentImageName || 'image.jpg'
          )
        } else if (imageUri?.startsWith('file://')) {
          fileUri = imageUri
        }

        // `expo-sharing`'s `shareAsync` resolves whether the user shares OR
        // cancels, so it can't tell us when sharing was aborted. On iOS we use
        // react-native `Share`, which reports `dismissedAction` on cancel, and
        // only show the success toast on a real share. Android's share intent
        // never reports completion, so we keep `shareAsync` and show no
        // (potentially false) toast.
        if (Platform.OS === 'ios') {
          const result = fileUri
            ? await Share.share({ url: fileUri })
            : await Share.share({
                title: currentImageName || 'Share Image',
                message: `${currentImageName || 'Image'}\n\n${imageUri}`
              })

          if (result.action === Share.dismissedAction) {
            return
          }

          Toast.show({
            type: 'baseToast',
            text1: t`Shared successfully!`,
            position: 'bottom',
            bottomOffset: 100
          })
          return
        }

        if (fileUri) {
          await shareAsync(fileUri, {
            mimeType: getMimeType(currentImageName),
            dialogTitle: 'Share Image'
          })
        } else {
          await Share.share({
            title: currentImageName || 'Share Image',
            message: `${currentImageName || 'Image'}\n\n${imageUri}`
          })
        }
      } catch {
        Toast.show({
          type: 'baseToast',
          text1: t`Failed to share image. Please try again.`,
          position: 'bottom',
          bottomOffset: 100
        })
      }
    }

    return (
      <Layout
        header={
          <BackScreenHeader
            title={currentImageName}
            onBack={() => navigation.goBack()}
            rightActions={
              <View style={styles.actionButtonsContainer}>
                <Button
                  variant="tertiary"
                  size="medium"
                  aria-label="Share"
                  iconBefore={
                    <ShareIcon color={theme.colors.colorTextPrimary} />
                  }
                  onClick={handleShare}
                />
                {isEditable && (
                  <BottomSheetFileMoreActionsContent
                    handleDelete={handleDelete}
                    handleRename={handleRename}
                    filename={currentImageName || ''}
                  />
                )}
              </View>
            }
          />
        }
      >
        <View style={styles.imageCard}>
          <Image
            source={{ uri: imageUri }}
            resizeMode="contain"
            style={[
              styles.styledImage,
              imageRatio ? { aspectRatio: imageRatio } : { height: 400 }
            ]}
            onLoad={handleImageLoad}
          />
        </View>
      </Layout>
    )
  }
)
