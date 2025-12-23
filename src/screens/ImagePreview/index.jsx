import { useLingui } from '@lingui/react/macro'
import { useNavigation } from '@react-navigation/native'
import { shareAsync } from 'expo-sharing'
import {
  BackIcon,
  DeleteIcon,
  ShareIcon
} from 'pearpass-lib-ui-react-native-components'
import { View, Share, Text, Image, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'
import { useTheme } from 'styled-components/native'

import { withAutoLockBypass } from '../../HOCs'
import { ButtonLittle } from '../../libComponents'
import { convertDataUriToFileUri } from '../../utils/convertDataUriToFileUri'
import { getMimeType } from '../../utils/getMimeType'

export const ImagePreview = withAutoLockBypass(({ route }) => {
  const { t } = useLingui()
  const navigation = useNavigation()
  const theme = useTheme()
  const { imageUri, imageName, onDelete } = route.params

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    }
    navigation.goBack()
  }

  const handleShare = async () => {
    try {
      if (imageUri?.startsWith('data:')) {
        const fileUri = await convertDataUriToFileUri(
          imageUri,
          imageName || 'image.jpg'
        )
        await shareAsync(fileUri, {
          mimeType: getMimeType(imageName),
          dialogTitle: 'Share Image'
        })
      } else if (imageUri?.startsWith('file://')) {
        await shareAsync(imageUri, {
          mimeType: getMimeType(imageName),
          dialogTitle: 'Share Image'
        })
      } else {
        await Share.share({
          title: imageName || 'Share Image',
          message: `${imageName || 'Image'}\n\n${imageUri}`
        })
      }
      Toast.show({
        type: 'baseToast',
        text1: t`Shared successfully!`,
        position: 'bottom',
        bottomOffset: 100
      })
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
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.grey500.mode1 }
      ]}
    >
      <View style={styles.header}>
        <ButtonLittle
          variant="secondary"
          borderRadius="md"
          startIcon={BackIcon}
          onPress={() => navigation.goBack()}
        />
        <Text
          style={[styles.imageTitle, { color: theme.colors.white.mode1 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {imageName || 'Image Preview'}
        </Text>
        <View style={styles.headerButtonsContainer}>
          <ButtonLittle
            variant="secondary"
            borderRadius="md"
            startIcon={ShareIcon}
            onPress={handleShare}
          />

          {onDelete && (
            <ButtonLittle
              variant="secondary"
              borderRadius="md"
              startIcon={DeleteIcon}
              onPress={handleDelete}
            />
          )}
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          resizeMode="contain"
          style={styles.styledImage}
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    flexDirection: 'column'
  },
  header: {
    flexShrink: 0,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imageTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
    marginRight: 12
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 64
  },
  styledImage: {
    width: '100%',
    height: '100%'
  }
})
