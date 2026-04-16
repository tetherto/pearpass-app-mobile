import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react'

const VaultSelectorContext = createContext({
  registerOpener: () => () => {},
  openVaultSelector: () => {}
})

export const VaultSelectorProvider = ({ children }) => {
  const openerRef = useRef(null)

  const registerOpener = useCallback((fn) => {
    openerRef.current = fn
    return () => {
      if (openerRef.current === fn) {
        openerRef.current = null
      }
    }
  }, [])

  const openVaultSelector = useCallback(() => {
    openerRef.current?.()
  }, [])

  return (
    <VaultSelectorContext.Provider
      value={{ registerOpener, openVaultSelector }}
    >
      {children}
    </VaultSelectorContext.Provider>
  )
}

export const useVaultSelector = () => useContext(VaultSelectorContext)

export const useRegisterVaultSelectorOpener = (open) => {
  const { registerOpener } = useVaultSelector()
  useEffect(() => registerOpener(open), [registerOpener, open])
}
