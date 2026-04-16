import { createContext, useCallback, useContext, useState } from 'react'

const VaultSelectorContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {}
})

export const VaultSelectorProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <VaultSelectorContext.Provider value={{ isOpen, open, close }}>
      {children}
    </VaultSelectorContext.Provider>
  )
}

export const useVaultSelector = () => useContext(VaultSelectorContext)
