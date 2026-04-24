export const SORT_KEYS = {
  TITLE_AZ: 'Title A-Z',
  LAST_UPDATED_NEWEST: 'Last Updated Newest',
  LAST_UPDATED_OLDEST: 'Last Updated Oldest',
  DATE_ADDED_NEWEST: 'Date Added Newest',
  DATE_ADDED_OLDEST: 'Date Added Oldest',
  RECENT: 'Recent',
  NEWEST_TO_OLDEST: 'Newest to oldest',
  OLDEST_TO_NEWEST: 'Oldest to newest'
}

export const SORT_BY_TYPE = {
  [SORT_KEYS.TITLE_AZ]: { key: 'data.title', direction: 'asc' },
  [SORT_KEYS.LAST_UPDATED_NEWEST]: { key: 'updatedAt', direction: 'desc' },
  [SORT_KEYS.LAST_UPDATED_OLDEST]: { key: 'updatedAt', direction: 'asc' },
  [SORT_KEYS.DATE_ADDED_NEWEST]: { key: 'createdAt', direction: 'desc' },
  [SORT_KEYS.DATE_ADDED_OLDEST]: { key: 'createdAt', direction: 'asc' },
  [SORT_KEYS.RECENT]: { key: 'updatedAt', direction: 'desc' },
  [SORT_KEYS.NEWEST_TO_OLDEST]: { key: 'createdAt', direction: 'desc' },
  [SORT_KEYS.OLDEST_TO_NEWEST]: { key: 'createdAt', direction: 'asc' }
}
