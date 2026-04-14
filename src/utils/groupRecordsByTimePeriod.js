/**
 * Groups records into time-period sections for SectionList.
 * Favorites are shown first as a separate section, then remaining
 * records are bucketed by the sort key's date field. Section order
 * follows the sort direction: descending = Today first, ascending = Older first.
 *
 * @param {Array} records - flat array of vault records (already sorted)
 * @param {{ key: string, direction: 'asc' | 'desc' }} [sort]
 * @returns {Array<{ title: string, key: string, isFavorites?: boolean, data: Array }>}
 */
export const groupRecordsByTimePeriod = (records, sort) => {
  if (sort?.key === 'data.title') {
    const favorites = records.filter((r) => r.isFavorite)
    const rest = records.filter((r) => !r.isFavorite)
    const sections = []
    if (favorites.length) {
      sections.push({
        title: 'Favorites',
        key: 'favorites',
        isFavorites: true,
        data: favorites
      })
    }
    if (rest.length) {
      sections.push({ title: 'All Items', key: 'all', data: rest })
    }
    return sections
  }

  const dateField = sort?.key === 'createdAt' ? 'createdAt' : 'updatedAt'
  const isAsc = sort?.direction === 'asc'

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const favorites = []
  const today = []
  const yesterday = []
  const thisWeek = []
  const thisMonth = []
  const older = []

  const favoriteIds = new Set()

  for (const record of records) {
    if (record.isFavorite) {
      favorites.push(record)
      favoriteIds.add(record.id)
    }
  }

  for (const record of records) {
    if (favoriteIds.has(record.id)) continue

    const date = new Date(
      record[dateField] || record.updatedAt || record.createdAt
    )

    if (date >= todayStart) {
      today.push(record)
    } else if (date >= yesterdayStart) {
      yesterday.push(record)
    } else if (date >= weekStart) {
      thisWeek.push(record)
    } else if (date >= monthStart) {
      thisMonth.push(record)
    } else {
      older.push(record)
    }
  }

  const timeSections = []

  if (today.length) {
    timeSections.push({ title: 'Today', key: 'today', data: today })
  }
  if (yesterday.length) {
    timeSections.push({ title: 'Yesterday', key: 'yesterday', data: yesterday })
  }
  if (thisWeek.length) {
    timeSections.push({ title: 'This Week', key: 'thisWeek', data: thisWeek })
  }
  if (thisMonth.length) {
    timeSections.push({
      title: 'This Month',
      key: 'thisMonth',
      data: thisMonth
    })
  }
  if (older.length) {
    timeSections.push({ title: 'Older', key: 'older', data: older })
  }

  if (isAsc) {
    timeSections.reverse()
  }

  const sections = []

  if (favorites.length) {
    sections.push({
      title: 'Favorites',
      key: 'favorites',
      isFavorites: true,
      data: favorites
    })
  }

  return sections.concat(timeSections)
}
