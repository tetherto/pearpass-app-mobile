import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native'

import { ATTACHMENTS_DIR_NAME, JOB_DIR_NAME, JOB_FILE_NAME } from './constants'
import { getSharedDirectoryPath } from '../utils/AppGroupHelper'

const getJobStorageBasePath = async () => {
  if (Platform.OS === 'ios') {
    const sharedDir = await getSharedDirectoryPath()
    if (sharedDir) {
      return `file://${sharedDir}/${JOB_DIR_NAME}`
    }
  }
  return `${FileSystem.documentDirectory}${JOB_DIR_NAME}`
}

export const getJobFilePath = async () => {
  const basePath = await getJobStorageBasePath()
  return `${basePath}/${JOB_FILE_NAME}`
}

export const getAttachmentsFolderPath = async () => {
  const basePath = await getJobStorageBasePath()
  return `${basePath}/${ATTACHMENTS_DIR_NAME}`
}

export const jobFileExists = async () => {
  const filePath = await getJobFilePath()
  const info = await FileSystem.getInfoAsync(filePath)
  return info.exists
}

export const deleteJobFile = async () => {
  const filePath = await getJobFilePath()
  await FileSystem.deleteAsync(filePath, { idempotent: true })
}

export const deleteAttachmentsFolder = async () => {
  const folderPath = await getAttachmentsFolderPath()
  await FileSystem.deleteAsync(folderPath, { idempotent: true })
}
