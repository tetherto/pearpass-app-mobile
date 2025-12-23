import { getMimeType } from './getMimeType'

describe('getMimeType', () => {
  it('should return correct MIME type for image extensions', () => {
    expect(getMimeType('photo.jpg')).toBe('image/jpeg')
    expect(getMimeType('photo.jpeg')).toBe('image/jpeg')
    expect(getMimeType('photo.png')).toBe('image/png')
    expect(getMimeType('photo.gif')).toBe('image/gif')
    expect(getMimeType('photo.webp')).toBe('image/webp')
    expect(getMimeType('photo.bmp')).toBe('image/bmp')
  })

  it('should return correct MIME type for document extensions', () => {
    expect(getMimeType('document.pdf')).toBe('application/pdf')
    expect(getMimeType('document.doc')).toBe('application/msword')
    expect(getMimeType('document.docx')).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    expect(getMimeType('spreadsheet.xls')).toBe('application/vnd.ms-excel')
    expect(getMimeType('spreadsheet.xlsx')).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    expect(getMimeType('file.txt')).toBe('text/plain')
    expect(getMimeType('data.json')).toBe('application/json')
    expect(getMimeType('archive.zip')).toBe('application/zip')
  })

  it('should handle uppercase extensions', () => {
    expect(getMimeType('photo.JPG')).toBe('image/jpeg')
    expect(getMimeType('document.PDF')).toBe('application/pdf')
  })

  it('should return default MIME type for unknown extensions', () => {
    expect(getMimeType('file.xyz')).toBe('application/octet-stream')
    expect(getMimeType('file.unknown')).toBe('application/octet-stream')
  })

  it('should return custom default type when provided', () => {
    expect(getMimeType('file.xyz', 'image/jpeg')).toBe('image/jpeg')
  })

  it('should handle null or undefined filename', () => {
    expect(getMimeType(null)).toBe('application/octet-stream')
    expect(getMimeType(undefined)).toBe('application/octet-stream')
  })

  it('should handle filename without extension', () => {
    expect(getMimeType('filename')).toBe('application/octet-stream')
  })
})
