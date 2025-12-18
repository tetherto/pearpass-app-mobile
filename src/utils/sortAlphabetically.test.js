import { sortAlphabetically } from './sortAlphabetically'

describe('sortAlphabetically', () => {
  it('should sort array by name in alphabetical order', () => {
    const input = [
      { name: 'Vault 1', id: '1' },
      { name: 'Vault 2', id: '2' },
      { name: 'Vault 3', id: '3' }
    ]
    const result = sortAlphabetically(input)
    expect(result).toEqual([
      { name: 'Vault 1', id: '1' },
      { name: 'Vault 2', id: '2' },
      { name: 'Vault 3', id: '3' }
    ])
  })

  it('should sort by custom key when provided', () => {
    const input = [
      { id: 'vault1', name: 'Vault 1' },
      { id: 'vault2', name: 'Vault 2' }
    ]
    const result = sortAlphabetically(input, 'id')
    expect(result).toEqual([
      { id: 'vault1', name: 'Vault 1' },
      { id: 'vault2', name: 'Vault 2' }
    ])
  })

  it('should return empty array when input is null, undefined, or empty', () => {
    expect(sortAlphabetically(null)).toEqual([])
    expect(sortAlphabetically(undefined)).toEqual([])
    expect(sortAlphabetically([])).toEqual([])
  })
})
