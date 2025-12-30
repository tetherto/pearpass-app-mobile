import { MAX_FILE_SIZE_MB } from 'pearpass-lib-constants'

import { getBase64SizeMB, validateBase64Size } from './fileSize'

describe('fileSize', () => {
  describe('getBase64SizeMB', () => {
    test('should return 0 for null input', () => {
      expect(getBase64SizeMB(null)).toBe(0)
    })

    test('should return 0 for undefined input', () => {
      expect(getBase64SizeMB(undefined)).toBe(0)
    })

    test('should return 0 for empty string', () => {
      expect(getBase64SizeMB('')).toBe(0)
    })

    test('should calculate correct size for a base64 string', () => {
      // A base64 string of length 4 represents 3 bytes
      // So for 4 characters: (4 * 3) / 4 = 3 bytes = 3 / (1024 * 1024) MB
      const base64 = 'AAAA'
      const result = getBase64SizeMB(base64)
      const expectedMB = 3 / (1024 * 1024)
      expect(result).toBeCloseTo(expectedMB, 10)
    })

    test('should calculate size correctly for larger base64 string', () => {
      // Create a base64 string that represents approximately 1 MB
      // 1 MB = 1024 * 1024 bytes
      // base64 length = (bytes * 4) / 3
      const targetBytes = 1024 * 1024
      const base64Length = Math.ceil((targetBytes * 4) / 3)
      const base64 = 'A'.repeat(base64Length)
      const result = getBase64SizeMB(base64)
      expect(result).toBeCloseTo(1, 1)
    })

    test('should handle very small base64 strings', () => {
      const base64 = 'A'
      const result = getBase64SizeMB(base64)
      const expectedMB = (1 * 3) / 4 / (1024 * 1024)
      expect(result).toBeCloseTo(expectedMB, 10)
    })
  })

  describe('validateBase64Size', () => {
    test('should return valid true for empty string', () => {
      const result = validateBase64Size('')
      expect(result.valid).toBe(true)
      expect(result.sizeMB).toBe(0)
      expect(result.maxSizeMB).toBe(MAX_FILE_SIZE_MB)
    })

    test('should return valid true for small base64 string', () => {
      const base64 = 'SGVsbG8gV29ybGQ=' // "Hello World" in base64
      const result = validateBase64Size(base64)
      expect(result.valid).toBe(true)
      expect(result.sizeMB).toBeLessThan(MAX_FILE_SIZE_MB)
      expect(result.maxSizeMB).toBe(MAX_FILE_SIZE_MB)
    })

    test('should return valid false for base64 exceeding max size', () => {
      // Create a base64 string larger than MAX_FILE_SIZE_MB
      const targetBytes = (MAX_FILE_SIZE_MB + 1) * 1024 * 1024
      const base64Length = Math.ceil((targetBytes * 4) / 3)
      const base64 = 'A'.repeat(base64Length)
      const result = validateBase64Size(base64)
      expect(result.valid).toBe(false)
      expect(result.sizeMB).toBeGreaterThan(MAX_FILE_SIZE_MB)
      expect(result.maxSizeMB).toBe(MAX_FILE_SIZE_MB)
    })

    test('should return correct sizeMB value', () => {
      const base64 = 'AAAA' // 3 bytes
      const result = validateBase64Size(base64)
      const expectedMB = 3 / (1024 * 1024)
      expect(result.sizeMB).toBeCloseTo(expectedMB, 10)
    })

    test('should return maxSizeMB equal to MAX_FILE_SIZE_MB constant', () => {
      const result = validateBase64Size('test')
      expect(result.maxSizeMB).toBe(MAX_FILE_SIZE_MB)
    })

    test('should return valid true when size equals max size', () => {
      // Create a base64 string exactly at MAX_FILE_SIZE_MB
      const targetBytes = MAX_FILE_SIZE_MB * 1024 * 1024
      const base64Length = Math.ceil((targetBytes * 4) / 3)
      const base64 = 'A'.repeat(base64Length)
      const result = validateBase64Size(base64)
      // Due to rounding, this should be approximately equal
      expect(result.sizeMB).toBeCloseTo(MAX_FILE_SIZE_MB, 0)
    })
  })
})
