import { areFilesEqual } from './areFilesEqual'

describe('areFilesEqual', () => {
  it('should return true for two empty arrays', () => {
    expect(areFilesEqual([], [])).toBe(true)
  })

  it('should return true for arrays with identical files', () => {
    const files1 = [
      { id: '1', name: 'file1.jpg', base64: 'data1' },
      { id: '2', name: 'file2.jpg', base64: 'data2' }
    ]
    const files2 = [
      { id: '1', name: 'file1.jpg', base64: 'data3' },
      { id: '2', name: 'file2.jpg', base64: 'data4' }
    ]
    expect(areFilesEqual(files1, files2)).toBe(true)
  })

  it('should return true when both arrays have no base64', () => {
    const files1 = [
      { id: '1', name: 'file1.jpg' },
      { id: '2', name: 'file2.jpg' }
    ]
    const files2 = [
      { id: '1', name: 'file1.jpg' },
      { id: '2', name: 'file2.jpg' }
    ]
    expect(areFilesEqual(files1, files2)).toBe(true)
  })

  it('should return false for arrays with different lengths', () => {
    const files1 = [{ id: '1', name: 'file1.jpg' }]
    const files2 = [
      { id: '1', name: 'file1.jpg' },
      { id: '2', name: 'file2.jpg' }
    ]
    expect(areFilesEqual(files1, files2)).toBe(false)
  })

  it('should return false when IDs differ', () => {
    const files1 = [{ id: '1', name: 'file1.jpg', base64: 'data' }]
    const files2 = [{ id: '2', name: 'file1.jpg', base64: 'data' }]
    expect(areFilesEqual(files1, files2)).toBe(false)
  })

  it('should return false when names differ', () => {
    const files1 = [{ id: '1', name: 'file1.jpg', base64: 'data' }]
    const files2 = [{ id: '1', name: 'file2.jpg', base64: 'data' }]
    expect(areFilesEqual(files1, files2)).toBe(false)
  })

  it('should return false when base64 presence differs', () => {
    const files1 = [{ id: '1', name: 'file1.jpg', base64: 'data' }]
    const files2 = [{ id: '1', name: 'file1.jpg' }]
    expect(areFilesEqual(files1, files2)).toBe(false)
  })

  it('should return false when one file has base64 and the other does not', () => {
    const files1 = [
      { id: '1', name: 'file1.jpg', base64: 'data1' },
      { id: '2', name: 'file2.jpg' }
    ]
    const files2 = [
      { id: '1', name: 'file1.jpg' },
      { id: '2', name: 'file2.jpg', base64: 'data2' }
    ]
    expect(areFilesEqual(files1, files2)).toBe(false)
  })

  it('should handle undefined or null gracefully', () => {
    expect(areFilesEqual(undefined, undefined)).toBe(true)
    expect(areFilesEqual(null, null)).toBe(true)
    expect(areFilesEqual(undefined, [])).toBe(true)
    expect(areFilesEqual([], null)).toBe(true)
  })

  it('should return false when comparing with undefined/null and non-empty array', () => {
    const files = [{ id: '1', name: 'file1.jpg' }]
    expect(areFilesEqual(files, undefined)).toBe(false)
    expect(areFilesEqual(undefined, files)).toBe(false)
  })
})
