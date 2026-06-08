type AttachmentLike = {
  id?: string | number
  name?: string
}

type RecordWithAttachments<T extends AttachmentLike = AttachmentLike> = {
  attachments?: T[]
  data?: unknown
}

export const getRecordAttachments = <T extends AttachmentLike>(
  record?: RecordWithAttachments<T> | null
): T[] => {
  if (!record) {
    return []
  }

  const dataAttachments = (record.data as { attachments?: T[] } | null | undefined)
    ?.attachments

  return record.attachments ?? dataAttachments ?? []
}
