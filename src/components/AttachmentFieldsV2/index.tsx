import React, { useCallback, useMemo, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  AttachmentField,
  Button,
  MultiSlotInput,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import { Keyboard, View } from 'react-native'
import {
  Add,
  TrashOutlined,
  UploadFileFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'

import { BottomSheetAttachmentActionsContentV2 } from '../../containers/BottomSheetAttachmentActionsContentV2/BottomSheetAttachmentActionsContentV2'
import { BottomSheetUploadFileContentV2 } from '../../containers/BottomSheetUploadFileContent/BottomSheetUploadFileContentV2'

const KEYBOARD_DISMISS_DELAY_MS = 250

type AttachmentLike = {
  id?: string | number
  name?: string
}

const ATTACHMENT_FIELD_ITEM_TYPES = {
  empty: 'empty',
  placeholder: 'placeholder',
  attachment: 'attachment'
} as const

type AttachmentFieldItemType =
  (typeof ATTACHMENT_FIELD_ITEM_TYPES)[keyof typeof ATTACHMENT_FIELD_ITEM_TYPES]

type AttachmentFieldItem<T extends AttachmentLike> =
  | {
      key: string
      type: Extract<AttachmentFieldItemType, 'empty'>
    }
  | {
      key: string
      type: Extract<AttachmentFieldItemType, 'placeholder'>
      placeholderId: number
    }
  | {
      key: string
      type: Extract<AttachmentFieldItemType, 'attachment'>
      attachment: T
      index: number
    }

type Props<T extends AttachmentLike> = {
  attachments: T[]
  isEditing: boolean
  onAdd: (file?: T | null) => void
  onReplace: (index: number, file?: T | null) => void
  onDelete: (index: number) => void
  testID?: string
}

export const AttachmentFieldsV2 = <T extends AttachmentLike>({
  attachments,
  isEditing,
  onAdd,
  onReplace,
  onDelete,
  testID = 'attachments-multi-slot-input'
}: Props<T>) => {
  const { t } = useLingui()
  const { theme } = useTheme()
  const placeholderCounterRef = useRef(0)
  const [placeholderIds, setPlaceholderIds] = useState<number[]>([])
  const [activeUploadTarget, setActiveUploadTarget] =
    useState<AttachmentFieldItem<T> | null>(null)

  const addAttachmentPlaceholder = useCallback(() => {
    const nextId = placeholderCounterRef.current
    placeholderCounterRef.current += 1

    setPlaceholderIds((prev) => [...prev, nextId])
  }, [])

  const removeAttachmentPlaceholder = useCallback((placeholderId: number) => {
    setPlaceholderIds((prev) => prev.filter((id) => id !== placeholderId))
  }, [])

  const attachmentFieldItems = useMemo<AttachmentFieldItem<T>[]>(
    () => [
      ...(!attachments.length && !placeholderIds.length
        ? [{ key: 'attachment-field-empty', type: ATTACHMENT_FIELD_ITEM_TYPES.empty }]
        : []),
      ...placeholderIds.map((placeholderId) => ({
        key: `attachment-field-empty-${placeholderId}`,
        type: ATTACHMENT_FIELD_ITEM_TYPES.placeholder,
        placeholderId
      })),
      ...attachments.map((attachment, index) => ({
        key:
          String(attachment?.id ?? '') ||
          attachment.name ||
          `attachment-field-${index}`,
        type: ATTACHMENT_FIELD_ITEM_TYPES.attachment,
        attachment,
        index
      }))
    ],
    [attachments, placeholderIds]
  )

  const closeUploadSheet = useCallback(() => {
    setActiveUploadTarget(null)
  }, [])

  const openUploadSheet = useCallback((item: AttachmentFieldItem<T>) => {
    Keyboard.dismiss()
    setTimeout(() => setActiveUploadTarget(item), KEYBOARD_DISMISS_DELAY_MS)
  }, [])

  const handleUploadSelect = useCallback(
    (file?: T | null) => {
      if (!activeUploadTarget) {
        return
      }

      if (activeUploadTarget.type === ATTACHMENT_FIELD_ITEM_TYPES.attachment) {
        onReplace(activeUploadTarget.index, file)
        return
      }

      onAdd(file)

      if (activeUploadTarget.type === ATTACHMENT_FIELD_ITEM_TYPES.placeholder) {
        removeAttachmentPlaceholder(activeUploadTarget.placeholderId)
      }
    },
    [activeUploadTarget, onAdd, onReplace, removeAttachmentPlaceholder]
  )

  const renderAttachmentRightSlot = (item: AttachmentFieldItem<T>) => {
    if (item.type !== ATTACHMENT_FIELD_ITEM_TYPES.attachment) {
      return (
        <Button
          size="small"
          variant="tertiary"
          aria-label="Upload attachment"
          iconBefore={
            <UploadFileFilled color={theme.colors.colorTextPrimary} />
          }
          onClick={() => openUploadSheet(item)}
        />
      )
    }

    if (!isEditing) {
      return (
        <Button
          size="small"
          variant="tertiary"
          aria-label="Delete attachment"
          iconBefore={<TrashOutlined color={theme.colors.colorTextPrimary} />}
          onClick={() => onDelete(item.index)}
        />
      )
    }

    return (
      <BottomSheetAttachmentActionsContentV2
        filename={item.attachment?.name ?? ''}
        onDelete={() => onDelete(item.index)}
        onEdit={() => openUploadSheet(item)}
      />
    )
  }

  const renderAttachmentField = (item: AttachmentFieldItem<T>) => (
    <AttachmentField
      key={item.key}
      label={t`Attachment`}
      value={
        item.type === ATTACHMENT_FIELD_ITEM_TYPES.attachment
          ? item.attachment?.name ?? ''
          : undefined
      }
      placeholder={
        item.type === ATTACHMENT_FIELD_ITEM_TYPES.attachment
          ? undefined
          : t`Add File / Photos Here`
      }
      isGrouped
      testID={
        item.type === ATTACHMENT_FIELD_ITEM_TYPES.attachment
          ? `attachment-field-${item.index}`
          : item.key
      }
      onClick={
        item.type !== ATTACHMENT_FIELD_ITEM_TYPES.attachment || isEditing
          ? () => openUploadSheet(item)
          : undefined
      }
      rightSlot={renderAttachmentRightSlot(item)}
    />
  )

  return (
    <View>
      <MultiSlotInput
        actions={
          <Button
            variant="tertiaryAccent"
            iconBefore={<Add />}
            onClick={addAttachmentPlaceholder}
          >
            {t`Add Another Attachment`}
          </Button>
        }
        testID={testID}
      >
        {attachmentFieldItems.map(renderAttachmentField)}
      </MultiSlotInput>

      <BottomSheetUploadFileContentV2
        open={activeUploadTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeUploadSheet()
          }
        }}
        onFileSelect={(file) => handleUploadSelect(file as T | null)}
      />
    </View>
  )
}
