import { fileCache, MAX_CACHE_SIZE, clearAllFileCache } from './filesCache'

describe('filesCache', () => {
  beforeEach(() => {
    clearAllFileCache()
  })

  describe('fileCache', () => {
    test('should be a Map instance', () => {
      expect(fileCache).toBeInstanceOf(Map)
    })

    test('should be initially empty after clear', () => {
      expect(fileCache.size).toBe(0)
    })

    test('should allow setting and getting values', () => {
      fileCache.set('key1', 'value1')
      expect(fileCache.get('key1')).toBe('value1')
    })

    test('should allow storing complex values', () => {
      const complexValue = {
        data: 'base64data',
        type: 'image/png',
        size: 1024
      }
      fileCache.set('file1', complexValue)
      expect(fileCache.get('file1')).toEqual(complexValue)
    })

    test('should support multiple entries', () => {
      fileCache.set('file1', 'data1')
      fileCache.set('file2', 'data2')
      fileCache.set('file3', 'data3')
      expect(fileCache.size).toBe(3)
      expect(fileCache.get('file1')).toBe('data1')
      expect(fileCache.get('file2')).toBe('data2')
      expect(fileCache.get('file3')).toBe('data3')
    })

    test('should overwrite existing keys', () => {
      fileCache.set('key', 'oldValue')
      fileCache.set('key', 'newValue')
      expect(fileCache.get('key')).toBe('newValue')
      expect(fileCache.size).toBe(1)
    })
  })

  describe('MAX_CACHE_SIZE', () => {
    test('should be defined', () => {
      expect(MAX_CACHE_SIZE).toBeDefined()
    })

    test('should be a number', () => {
      expect(typeof MAX_CACHE_SIZE).toBe('number')
    })

    test('should be 100', () => {
      expect(MAX_CACHE_SIZE).toBe(100)
    })

    test('should be a positive integer', () => {
      expect(MAX_CACHE_SIZE).toBeGreaterThan(0)
      expect(Number.isInteger(MAX_CACHE_SIZE)).toBe(true)
    })
  })

  describe('clearAllFileCache', () => {
    test('should clear all entries from the cache', () => {
      fileCache.set('file1', 'data1')
      fileCache.set('file2', 'data2')
      fileCache.set('file3', 'data3')
      expect(fileCache.size).toBe(3)

      clearAllFileCache()

      expect(fileCache.size).toBe(0)
    })

    test('should not throw when clearing empty cache', () => {
      expect(() => clearAllFileCache()).not.toThrow()
      expect(fileCache.size).toBe(0)
    })

    test('should allow adding entries after clearing', () => {
      fileCache.set('file1', 'data1')
      clearAllFileCache()
      fileCache.set('file2', 'data2')

      expect(fileCache.size).toBe(1)
      expect(fileCache.get('file2')).toBe('data2')
      expect(fileCache.has('file1')).toBe(false)
    })

    test('should be callable multiple times', () => {
      clearAllFileCache()
      clearAllFileCache()
      clearAllFileCache()
      expect(fileCache.size).toBe(0)
    })
  })
})
