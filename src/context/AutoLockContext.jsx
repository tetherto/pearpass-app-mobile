import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import * as SecureStore from 'expo-secure-store'
import { DEFAULT_AUTO_LOCK_TIMEOUT } from 'pearpass-lib-constants'

import { SECURE_STORAGE_KEYS } from '../constants/secureStorageKeys'
import { logger } from '../utils/logger'

const AutoLockContext = createContext({
  shouldBypassAutoLock: false,
  setShouldBypassAutoLock: () => {},
  autoLockTimeout: DEFAULT_AUTO_LOCK_TIMEOUT,
  setAutoLockTimeout: () => {},
  isAutoLockEnabled: true
})

export const AutoLockProvider = ({ children }) => {
  const [shouldBypassAutoLock, setShouldBypassAutoLock] = useState(false)
  const [autoLockTimeout, setAutoLockTimeoutState] = useState(
    DEFAULT_AUTO_LOCK_TIMEOUT
  )
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadSavedTimeout = async () => {
      try {
        const savedTimeout = await SecureStore.getItemAsync(
          SECURE_STORAGE_KEYS.AUTO_LOCK_TIMEOUT
        )
        if (savedTimeout !== null) {
          const parsedTimeout =
            savedTimeout === 'null' ? null : Number(savedTimeout)
          setAutoLockTimeoutState(parsedTimeout)
        }
      } catch (error) {
        logger.error('Error loading auto-lock timeout:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSavedTimeout()
  }, [])

  const setAutoLockTimeout = useCallback(async (timeout) => {
    setAutoLockTimeoutState(timeout)
    try {
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.AUTO_LOCK_TIMEOUT,
        String(timeout)
      )
    } catch (error) {
      logger.error('Error saving auto-lock timeout:', error)
    }
  }, [])

  const isAutoLockEnabled = autoLockTimeout !== null

  const autoLockContextValue = useMemo(
    () => ({
      shouldBypassAutoLock,
      setShouldBypassAutoLock,
      autoLockTimeout,
      setAutoLockTimeout,
      isAutoLockEnabled
    }),
    [
      shouldBypassAutoLock,
      autoLockTimeout,
      setAutoLockTimeout,
      isAutoLockEnabled
    ]
  )

  if (!isLoaded) {
    return null
  }

  return (
    <AutoLockContext.Provider value={autoLockContextValue}>
      {children}
    </AutoLockContext.Provider>
  )
}

export const useAutoLockContext = () => useContext(AutoLockContext)
