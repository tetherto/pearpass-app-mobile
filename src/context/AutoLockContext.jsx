import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import * as SecureStore from 'expo-secure-store'
import {
  DEFAULT_AUTO_LOCK_TIMEOUT,
  AUTO_LOCK_ENABLED
} from 'pearpass-lib-constants'

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

  const interactionListenerRef = useRef(null)

  useEffect(() => {
    const loadSavedTimeout = async () => {
      try {
        if (!AUTO_LOCK_ENABLED) {
          setAutoLockTimeoutState(DEFAULT_AUTO_LOCK_TIMEOUT)
          setIsLoaded(true)
          return
        }

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

  const registerInteractionListener = useCallback((listener) => {
    interactionListenerRef.current = listener
  }, [])

  const notifyInteraction = useCallback(() => {
    if (interactionListenerRef.current) {
      interactionListenerRef.current()
    }
  }, [])

  const autoLockContextValue = useMemo(
    () => ({
      shouldBypassAutoLock,
      setShouldBypassAutoLock,
      autoLockTimeout,
      setAutoLockTimeout,
      isAutoLockEnabled,
      registerInteractionListener,
      notifyInteraction
    }),
    [
      shouldBypassAutoLock,
      autoLockTimeout,
      setAutoLockTimeout,
      isAutoLockEnabled,
      registerInteractionListener,
      notifyInteraction
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
