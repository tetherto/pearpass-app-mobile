/**
 * Compares two arrays of file objects to determine if they are equal.
 * Files are considered equal if they have the same IDs, names, and base64 presence.
 *
 * @param {Array} a - First array of file objects
 * @param {Array} b - Second array of file objects
 * @returns {boolean} True if arrays are equal, false otherwise
 */
export const areFilesEqual = (a = [], b = []) =>
  a.length === b.length &&
  a.every((file, idx) => {
    const existing = b[idx]
    return (
      existing &&
      file.id === existing.id &&
      file.name === existing.name &&
      !!file.base64 === !!existing.base64
    )
  })
