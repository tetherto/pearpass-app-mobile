import * as FileSystem from 'expo-file-system'

import {
  getJobFilePath,
  getAttachmentsFolderPath,
  jobFileExists,
  deleteJobFile,
  deleteAttachmentsFolder
} from './JobFileReader'
import { getSharedDirectoryPath } from '../utils/AppGroupHelper'

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///mock-document-dir/',
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn()
}))

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' }
}))

jest.mock('../utils/AppGroupHelper', () => ({
  getSharedDirectoryPath: jest.fn()
}))

describe('JobFileReader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getJobFilePath', () => {
    it('should return iOS shared directory path when available', async () => {
      getSharedDirectoryPath.mockResolvedValue('/shared/group')

      const result = await getJobFilePath()

      expect(result).toBe('file:///shared/group/pearpass_jobs/jobs.enc')
    })

    it('should fallback to document directory when shared dir is null', async () => {
      getSharedDirectoryPath.mockResolvedValue(null)

      const result = await getJobFilePath()

      expect(result).toBe('file:///mock-document-dir/pearpass_jobs/jobs.enc')
    })
  })

  describe('getAttachmentsFolderPath', () => {
    it('should return iOS shared directory attachments path', async () => {
      getSharedDirectoryPath.mockResolvedValue('/shared/group')

      const result = await getAttachmentsFolderPath()

      expect(result).toBe('file:///shared/group/pearpass_jobs/attachments')
    })

    it('should fallback to document directory attachments path', async () => {
      getSharedDirectoryPath.mockResolvedValue(null)

      const result = await getAttachmentsFolderPath()

      expect(result).toBe('file:///mock-document-dir/pearpass_jobs/attachments')
    })
  })

  describe('jobFileExists', () => {
    it('should return true when job file exists', async () => {
      getSharedDirectoryPath.mockResolvedValue('/shared/group')
      FileSystem.getInfoAsync.mockResolvedValue({ exists: true })

      const result = await jobFileExists()

      expect(result).toBe(true)
      expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(
        'file:///shared/group/pearpass_jobs/jobs.enc'
      )
    })

    it('should return false when job file does not exist', async () => {
      getSharedDirectoryPath.mockResolvedValue('/shared/group')
      FileSystem.getInfoAsync.mockResolvedValue({ exists: false })

      const result = await jobFileExists()

      expect(result).toBe(false)
    })
  })

  describe('deleteJobFile', () => {
    it('should delete the job file with idempotent option', async () => {
      getSharedDirectoryPath.mockResolvedValue('/shared/group')
      FileSystem.deleteAsync.mockResolvedValue()

      await deleteJobFile()

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///shared/group/pearpass_jobs/jobs.enc',
        { idempotent: true }
      )
    })
  })

  describe('deleteAttachmentsFolder', () => {
    it('should delete the attachments folder with idempotent option', async () => {
      getSharedDirectoryPath.mockResolvedValue('/shared/group')
      FileSystem.deleteAsync.mockResolvedValue()

      await deleteAttachmentsFolder()

      expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
        'file:///shared/group/pearpass_jobs/attachments',
        { idempotent: true }
      )
    })
  })
})
