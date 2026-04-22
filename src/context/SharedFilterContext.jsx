import { createContext, useContext, useState } from 'react'

import { SORT_KEYS } from '../constants/sortOptions'
import { isV2 } from '../utils/designVersion'

const SharedFilterContext = createContext()

export const INITIAL_STATE = {
  folder: 'allFolder',
  isFavorite: false,
  sort: isV2() ? SORT_KEYS.LAST_UPDATED_NEWEST : SORT_KEYS.RECENT
}

/**
 * @param {{
 *    children: React.ReactNode
 * }} props
 */
export const SharedFilterProvider = ({ children }) => {
  const [state, setState] = useState(INITIAL_STATE)

  return (
    <SharedFilterContext.Provider value={{ state, setState }}>
      {children}
    </SharedFilterContext.Provider>
  )
}

/**
 * @returns {{
 *   state: { folder: string, isFavorite: boolean, sort: string },
 *   setState: Function
 * }}
 */
export const useSharedFilter = () => useContext(SharedFilterContext)
