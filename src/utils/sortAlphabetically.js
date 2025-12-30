/**
 * Sorts alphabetically by name (or id if name is not available)
 * @param {Array} arr - Array of vault objects
 * @param {string} key - Key to sort by
 * @returns {Array} - Sorted array of vaults
 */
export const sortAlphabetically = (arr, key = 'name') => {
  if (!arr?.length) return []

  return [...arr].sort((a, b) => {
    const nameA = a?.[key] ?? ''
    const nameB = b?.[key] ?? ''
    return nameA.localeCompare(nameB)
  })
}
