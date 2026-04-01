import { createContext, useContext, useState } from 'react'

const SharedFilterContext = createContext()

export const INITIAL_STATE = {
  folder: 'allFolder',
  isFavorite: false,
  sort: 'Recent'
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
