import { downloadFile } from './downloadFile'
import { shareExportFile } from './shareExportFile'

jest.mock('./shareExportFile', () => ({
  shareExportFile: jest.fn()
}))

describe('downloadFile', () => {
  const filename = 'testfile.json'
  const content = '{"foo":"bar"}'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shares the file as JSON', async () => {
    await downloadFile({ filename, content }, 'json')

    expect(shareExportFile).toHaveBeenCalledWith({
      filename,
      content,
      mimeType: 'application/json'
    })
  })

  it('shares the file as CSV', async () => {
    const csvFilename = 'test.csv'
    const csvContent = 'a,b,c\n1,2,3'

    await downloadFile({ filename: csvFilename, content: csvContent }, 'csv')

    expect(shareExportFile).toHaveBeenCalledWith({
      filename: csvFilename,
      content: csvContent,
      mimeType: 'text/csv'
    })
  })

  it('propagates cancellation', async () => {
    const error = new Error('cancelled')
    shareExportFile.mockRejectedValueOnce(error)

    await expect(downloadFile({ filename, content }, 'json')).rejects.toBe(
      error
    )
  })
})
