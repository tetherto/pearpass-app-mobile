export const JobType = {
  ADD_PASSKEY: 'ADD_PASSKEY',
  UPDATE_PASSKEY: 'UPDATE_PASSKEY'
}

export const JobStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
}

export const MAGIC_BYTES = 'PPJQ'
export const VERSION = 1

export const MAX_RETRIES = 3
export const POST_RESUME_DELAY_MS = 500
export const SAFETY_THRESHOLD_MS = 1000

export const JOB_FILE_NAME = 'jobs.enc'
export const JOB_DIR_NAME = 'pearpass_jobs'
export const ATTACHMENTS_DIR_NAME = 'attachments'
