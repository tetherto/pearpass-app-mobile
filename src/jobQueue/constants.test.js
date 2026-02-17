import {
  JobType,
  JobStatus,
  MAGIC_BYTES,
  VERSION,
  MAX_RETRIES,
  POST_RESUME_DELAY_MS,
  SAFETY_THRESHOLD_MS,
  JOB_FILE_NAME,
  JOB_DIR_NAME,
  ATTACHMENTS_DIR_NAME
} from './constants'

describe('jobQueue constants', () => {
  describe('JobType', () => {
    it('should define ADD_PASSKEY', () => {
      expect(JobType.ADD_PASSKEY).toBe('ADD_PASSKEY')
    })

    it('should define UPDATE_PASSKEY', () => {
      expect(JobType.UPDATE_PASSKEY).toBe('UPDATE_PASSKEY')
    })
  })

  describe('JobStatus', () => {
    it('should define PENDING', () => {
      expect(JobStatus.PENDING).toBe('PENDING')
    })

    it('should define IN_PROGRESS', () => {
      expect(JobStatus.IN_PROGRESS).toBe('IN_PROGRESS')
    })

    it('should define COMPLETED', () => {
      expect(JobStatus.COMPLETED).toBe('COMPLETED')
    })

    it('should define FAILED', () => {
      expect(JobStatus.FAILED).toBe('FAILED')
    })
  })

  describe('file format constants', () => {
    it('should define MAGIC_BYTES', () => {
      expect(MAGIC_BYTES).toBe('PPJQ')
    })

    it('should define VERSION', () => {
      expect(VERSION).toBe(1)
    })
  })

  describe('configuration constants', () => {
    it('should define MAX_RETRIES', () => {
      expect(MAX_RETRIES).toBe(3)
    })

    it('should define POST_RESUME_DELAY_MS', () => {
      expect(POST_RESUME_DELAY_MS).toBe(500)
    })

    it('should define SAFETY_THRESHOLD_MS', () => {
      expect(SAFETY_THRESHOLD_MS).toBe(1000)
    })
  })

  describe('path constants', () => {
    it('should define JOB_FILE_NAME', () => {
      expect(JOB_FILE_NAME).toBe('jobs.enc')
    })

    it('should define JOB_DIR_NAME', () => {
      expect(JOB_DIR_NAME).toBe('pearpass_jobs')
    })

    it('should define ATTACHMENTS_DIR_NAME', () => {
      expect(ATTACHMENTS_DIR_NAME).toBe('attachments')
    })
  })
})
