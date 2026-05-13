import { ReactNode, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import { MAX_FILE_SIZE_MB } from '@tetherto/pearpass-lib-constants'
import {
  Button,
  ContextMenu,
  Text,
  rawTokens,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Close } from '@tetherto/pearpass-lib-ui-kit/icons'
import { StyleSheet, View } from 'react-native'

import { withAutoLockBypass } from '../../HOCs'
import { handleChooseFile, handleChooseMedia } from '../../utils/handleChooseFile'

type AttachmentFile = {
  base64: string
  name: string
}

type Props = {
  onFileSelect?: (file: AttachmentFile) => void
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  testID?: string
}

type BodyProps = {
  onFileSelect?: (file: AttachmentFile) => void
  onClose?: () => void
}

enum PickerAction {
  File = 'file',
  Media = 'media'
}

const BottomSheetUploadFileBodyV2Content = ({
  onFileSelect,
  onClose
}: BodyProps) => {
  const [isFileSizeWarning, setIsFileSizeWarning] = useState(false)
  const [loadingAction, setLoadingAction] = useState<PickerAction | null>(null)
  const { t } = useLingui()
  const { theme } = useTheme()

  const handleFileSizeWarning = () => {
    setIsFileSizeWarning(true)
  }

  const launchPicker = (
    action: PickerAction,
    picker: () => Promise<void>
  ) => {
    setLoadingAction(action)

    requestAnimationFrame(() => {
      const pickerPromise = picker()
      setLoadingAction(null)
      void pickerPromise
    })
  }

  const handleSelect = (file?: AttachmentFile | null) => {
    if (!file) {
      return
    }

    if (isFileSizeWarning) {
      setIsFileSizeWarning(false)
    }

    onFileSelect?.(file)
    onClose?.()
  }

  return (
    <View
      style={[
        styles.sheetContent,
        {
          backgroundColor: theme.colors.colorSurfacePrimary,
          paddingBottom: rawTokens.spacing24
        }
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text variant="bodyEmphasized">{t`Upload Attachment`}</Text>
        </View>

        <Button
          variant="tertiary"
          size="medium"
          aria-label="Close upload attachment"
          iconBefore={<Close color={theme.colors.colorTextPrimary} />}
          onClick={onClose}
        />
      </View>

      <View style={styles.content}>
        <Text
          color={
            isFileSizeWarning
              ? theme.colors.colorSurfaceDestructiveElevated
              : theme.colors.colorTextSecondary
          }
        >
          {isFileSizeWarning
            ? t`Your file is too large. Please upload one that’s ${MAX_FILE_SIZE_MB}MB or smaller.`
            : t`Maximum file size: ${MAX_FILE_SIZE_MB}MB`}
        </Text>

        <View style={styles.actions}>
          <Button
            variant="primary"
            size="medium"
            fullWidth
            isLoading={loadingAction === PickerAction.File}
            onClick={() =>
              launchPicker(PickerAction.File, () =>
                handleChooseFile(handleSelect, handleFileSizeWarning)
              )
            }
          >
            {t`Choose File`}
          </Button>

          <Button
            variant="primary"
            size="medium"
            fullWidth
            isLoading={loadingAction === PickerAction.Media}
            onClick={() =>
              launchPicker(PickerAction.Media, () =>
                handleChooseMedia(handleSelect, handleFileSizeWarning)
              )
            }
          >
            {t`Choose Photo / Video`}
          </Button>
        </View>
      </View>
    </View>
  )
}

export const BottomSheetUploadFileBodyV2 = withAutoLockBypass(
  BottomSheetUploadFileBodyV2Content
)

export const BottomSheetUploadFileContentV2 = withAutoLockBypass(
  ({ onFileSelect, trigger, open, onOpenChange, testID }: Props) => (
    <ContextMenu
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      testID={testID}
    >
      <BottomSheetUploadFileBodyV2
        onFileSelect={onFileSelect}
        onClose={() => onOpenChange?.(false)}
      />
    </ContextMenu>
  )
)

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: rawTokens.spacing16,
    paddingTop: rawTokens.spacing8,
    gap: rawTokens.spacing8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  content: {
    gap: rawTokens.spacing16,
    paddingTop: rawTokens.spacing8
  },
  actions: {
    gap: rawTokens.spacing12
  }
})
