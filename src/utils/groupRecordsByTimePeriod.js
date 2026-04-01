/**
 * Groups records into time-period sections for SectionList.
 * Favorites are shown first as a separate section, then remaining
 * records are grouped by: Today, Yesterday, This Week, This Month, Older.
 *
 * @param {Array} records - flat array of vault records
 * @returns {Array<{ title: string, key: string, isFavorites?: boolean, data: Array }>}
 */
export const groupRecordsByTimePeriod = (records) => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - todayStart.getDay())
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

    const date = new Date(record.updatedAt || record.createdAt)

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

  const sections = []

  if (favorites.length) {
    sections.push({
      title: 'Favorites',
      key: 'favorites',
      isFavorites: true,
      data: favorites
    })
  }
  if (today.length) {
    sections.push({ title: 'Today', key: 'today', data: today })
  }
  if (yesterday.length) {
    sections.push({ title: 'Yesterday', key: 'yesterday', data: yesterday })
  }
  if (thisWeek.length) {
    sections.push({ title: 'This week', key: 'thisWeek', data: thisWeek })
  }
  if (thisMonth.length) {
    sections.push({ title: 'This Month', key: 'thisMonth', data: thisMonth })
  }
  if (older.length) {
    sections.push({ title: 'Older', key: 'older', data: older })
  }

  return sections
}
