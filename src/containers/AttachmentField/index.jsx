import { useNavigation } from '@react-navigation/native'
import {
  CommonFileIcon,
  PlusIcon
} from 'pearpass-lib-ui-react-native-components'
import { TouchableOpacity } from 'react-native'

import {
  AdditionalItems,
  AttachmentName,
  IconWrapper,
  InputAreaWrapper,
  Label,
  MainWrapper,
  Wrapper
} from './styles'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { ButtonLittle } from '../../libComponents'
import { handleDownloadFile } from '../../utils/handleDownloadFile'
import { BottomSheetUploadFileContent } from '../BottomSheetUploadFileContent'

const MAX_EXTENSION_LENGTH = 4

/**
 *
 * @param {string} fileName - The name of the file to check.
 * @returns {boolean} True if the file is an image, false otherwise.
 */
const isImageFile = (fileName) => {
  if (!fileName) return false
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg']
  const extension = fileName.split('.').pop()?.toLowerCase()
  return imageExtensions.includes(extension)
}

/**
 *
 * @param {string} fileName - The name of the file to truncate.
 * @param {number} [maxLength=20] - The maximum allowed length for the file name.
 * @returns {string} The truncated file name with the extension preserved, or the original file name if no truncation is needed.
 */
const truncateFileName = (fileName, maxLength = 20) => {
  if (!fileName) return fileName

  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1) return fileName

  if (fileName.length <= maxLength) return fileName

  const extension = fileName.slice(lastDotIndex + 1)
  const nameWithoutExtension = fileName.slice(0, lastDotIndex)

  if (
    nameWithoutExtension.length <=
    maxLength - extension.length - MAX_EXTENSION_LENGTH
  ) {
    return fileName
  }

  const truncatedName = nameWithoutExtension.substring(
    0,
    maxLength - extension.length - MAX_EXTENSION_LENGTH
  )
  return `${truncatedName}...${extension}`
}

/**
 * AttachmentField component for displaying and managing file attachments.
 *
 * @param {Object} props - Component props.
 * @param {Object} [props.attachment] - The current attachment object, containing file details.
 * @param {string} props.label - Label to display for the attachment field.
 * @param {React.ReactNode} [props.additionalItems] - Additional items to render alongside the field.
 * @param {boolean} [props.isFirst] - Whether this field is the first in a list.
 * @param {boolean} [props.isLast] - Whether this field is the last in a list.
 * @param {function} [props.onUpload] - Callback function triggered when a file is uploaded.
 * @param {number} [props.attachmentIndex] - Index of the attachment in a list.
 * @param {function} [props.onDelete] - Callback function triggered when an attachment is deleted.
 * @param {string} [props.testID] - Test ID for the field wrapper.
 * @param {string} [props.accessibilityLabel] - Accessibility label for the field wrapper.
 * @param {string} [props.inputTestID] - Test ID for the input area.
 * @param {string} [props.inputAccessibilityLabel] - Accessibility label for the input area.
 * @param {string} [props.addButtonTestID] - Test ID for the add button.
 * @param {string} [props.addButtonAccessibilityLabel] - Accessibility label for the add button.
 * @returns {JSX.Element} The rendered AttachmentField component.
 */
export const AttachmentField = ({
  attachment,
  label,
  additionalItems,
  isFirst,
  isLast,
  onUpload,
  attachmentIndex,
  onDelete,
  testID,
  accessibilityLabel,
  inputTestID,
  inputAccessibilityLabel,
  addButtonTestID,
  addButtonAccessibilityLabel
}) => {
  const { expand, collapse } = useBottomSheet()
  const navigation = useNavigation()
  const { setShouldBypassAutoLock } = useAutoLockContext()

  const handleUpload = () => {
    expand({
      children: (
        <BottomSheetUploadFileContent
          onFileSelect={(file) => {
            onUpload(file)
            collapse()
          }}
        />
      ),
      snapPoints: ['25%', '25%', '40%']
    })
  }

  const handleAttachmentPress = async () => {
    if (!attachment || onUpload) return

    const isImage = isImageFile(attachment.name)

    if (isImage) {
      const uri = attachment.base64
        ? `data:image/jpeg;base64,${attachment.base64}`
        : undefined

      navigation.navigate('ImagePreview', {
        imageUri: uri,
        imageName: attachment.name,
        onDelete: onDelete ? () => onDelete(attachmentIndex) : undefined
      })
    } else {
      try {
        setShouldBypassAutoLock(true)
        await handleDownloadFile(attachment)
      } finally {
        setShouldBypassAutoLock(false)
      }
    }
  }

  return (
    <Wrapper
      isFirst={isFirst}
      isLast={isLast}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      <IconWrapper>
        <CommonFileIcon size={21} />
      </IconWrapper>

      <MainWrapper>
        <Label>{label}</Label>

        <InputAreaWrapper
          testID={inputTestID}
          accessibilityLabel={inputAccessibilityLabel}
        >
          <TouchableOpacity onPress={handleAttachmentPress}>
            <AttachmentName isPlaceHolder={!attachment}>
              {!attachment ? 'Add file' : truncateFileName(attachment?.name)}
            </AttachmentName>
          </TouchableOpacity>
        </InputAreaWrapper>
      </MainWrapper>

      {onUpload && (
        <ButtonLittle
          startIcon={PlusIcon}
          variant="secondary"
          borderRadius="md"
          onPress={handleUpload}
          testID={addButtonTestID}
          accessibilityLabel={addButtonAccessibilityLabel}
        />
      )}

      {additionalItems && <AdditionalItems>{additionalItems}</AdditionalItems>}
    </Wrapper>
  )
}
