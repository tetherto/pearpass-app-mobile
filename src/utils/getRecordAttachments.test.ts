import { getRecordAttachments } from './getRecordAttachments'

describe('getRecordAttachments', () => {
  it('returns top-level attachments when present', () => {
    const attachments = [{ id: '1', name: 'file.txt' }]

    expect(
      getRecordAttachments({
        attachments,
        data: { attachments: [{ id: '2', name: 'other.txt' }] }
      })
    ).toEqual(attachments)
  })

  it('falls back to data.attachments when top-level is missing', () => {
    const attachments = [{ id: '1', name: 'file.txt' }]

    expect(getRecordAttachments({ data: { attachments } })).toEqual(attachments)
  })

  it('returns an empty array when record is undefined', () => {
    expect(getRecordAttachments()).toEqual([])
  })
})
