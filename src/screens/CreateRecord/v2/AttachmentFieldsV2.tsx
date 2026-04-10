import React, { useCallback, useMemo, useRef, useState } from 'react'

import { useLingui } from '@lingui/react/macro'
import {
  AttachmentField,
  Button,
  MultiSlotInput,
  useTheme
} from '@tetherto/pearpass-lib-ui-kit'
import {
  Add,
  TrashOutlined,
  UploadFileFilled
} from '@tetherto/pearpass-lib-ui-kit/icons'

import { BottomSheetAttachmentActionsContentV2 } from '../../../containers/BottomSheetAttachmentActionsContentV2/BottomSheetAttachmentActionsContentV2'
import { BottomSheetUploadFileContentV2 } from '../../../containers/BottomSheetUploadFileContent/BottomSheetUploadFileContentV2'

type AttachmentLike = {
  id?: string | number
  name?: string
}

type AttachmentFieldItem<T extends AttachmentLike> =
  | {
      key: string
      type: 'empty'
    }
  | {
      key: string
      type: 'placeholder'
      placeholderId: number
    }
  | {
      key: string
      type: 'attachment'
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
        ? [{ key: 'attachment-field-empty', type: 'empty' as const }]
        : []),
      ...placeholderIds.map((placeholderId) => ({
        key: `attachment-field-empty-${placeholderId}`,
        type: 'placeholder' as const,
        placeholderId
      })),
      ...attachments.map((attachment, index) => ({
        key:
          String(attachment?.id ?? '') ||
          attachment.name ||
          `attachment-field-${index}`,
        type: 'attachment' as const,
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
    setActiveUploadTarget(item)
  }, [])

  const handleUploadSelect = useCallback(
    (file?: T | null) => {
      if (!activeUploadTarget) {
        return
      }

      if (activeUploadTarget.type === 'attachment') {
        onReplace(activeUploadTarget.index, file)
        return
      }

      onAdd(file)

      if (activeUploadTarget.type === 'placeholder') {
        removeAttachmentPlaceholder(activeUploadTarget.placeholderId)
      }
    },
    [activeUploadTarget, onAdd, onReplace, removeAttachmentPlaceholder]
  )

  const renderAttachmentRightSlot = (item: AttachmentFieldItem<T>) => {
    if (item.type !== 'attachment') {
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
      value={item.type === 'attachment' ? item.attachment?.name ?? '' : undefined}
      placeholder={
        item.type === 'attachment' ? undefined : t`Add File / Photos Here`
      }
      isGrouped
      testID={
        item.type === 'attachment' ? `attachment-field-${item.index}` : item.key
      }
      onClick={
        item.type !== 'attachment' || isEditing
          ? () => openUploadSheet(item)
          : undefined
      }
      rightSlot={renderAttachmentRightSlot(item)}
    />
  )

  return (
    <>
      <MultiSlotInput
        actions={
          <Button
            variant="tertiary"
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
    </>
  )
}
