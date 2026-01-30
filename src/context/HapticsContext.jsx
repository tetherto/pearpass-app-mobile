import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import * as Haptics from 'expo-haptics'
import * as SecureStore from 'expo-secure-store'

import { SECURE_STORAGE_KEYS } from '../constants/secureStorageKeys'
import { logger } from '../utils/logger'

/**
 * @typedef {Object} HapticsContextValue
 * @property {boolean} isHapticsEnabled
 * @property {(enabled: boolean) => Promise<void>} setIsHapticsEnabled
 * @property {(style?: Haptics.ImpactFeedbackStyle) => void} triggerImpact
 * @property {() => void} triggerSelection
 * @property {(type?: Haptics.NotificationFeedbackType) => void} triggerNotification
 */

const HapticsContext = createContext({
  isHapticsEnabled: true,
  setIsHapticsEnabled: () => {},
  triggerImpact: () => {},
  triggerSelection: () => {},
  triggerNotification: () => {}
})

export const HapticsProvider = ({ children }) => {
  const [isHapticsEnabled, setIsHapticsEnabledState] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadSavedPreference = async () => {
      try {
        const savedValue = await SecureStore.getItemAsync(
          SECURE_STORAGE_KEYS.HAPTICS_ENABLED
        )
        if (savedValue !== null) {
          setIsHapticsEnabledState(savedValue === 'true')
        }
      } catch (error) {
        logger.error('Error loading haptics preference:', error)
      } finally {
        setIsLoaded(true)
      }
    }
    loadSavedPreference()
  }, [])

  const setIsHapticsEnabled = useCallback(async (enabled) => {
    setIsHapticsEnabledState(enabled)
    try {
      await SecureStore.setItemAsync(
        SECURE_STORAGE_KEYS.HAPTICS_ENABLED,
        String(enabled)
      )
    } catch (error) {
      logger.error('Error saving haptics preference:', error)
    }
  }, [])

  const triggerImpact = useCallback(
    (style = Haptics.ImpactFeedbackStyle.Medium) => {
      if (!isHapticsEnabled) return
      try {
        Haptics.impactAsync(style)
      } catch (error) {
        logger.error('Error triggering impact haptic:', error)
      }
    },
    [isHapticsEnabled]
  )

  const triggerSelection = useCallback(() => {
    if (!isHapticsEnabled) return
    try {
      Haptics.selectionAsync()
    } catch (error) {
      logger.error('Error triggering selection haptic:', error)
    }
  }, [isHapticsEnabled])

  const triggerNotification = useCallback(
    (type = Haptics.NotificationFeedbackType.Success) => {
      if (!isHapticsEnabled) return
      try {
        Haptics.notificationAsync(type)
      } catch (error) {
        logger.error('Error triggering notification haptic:', error)
      }
    },
    [isHapticsEnabled]
  )

  const hapticsContextValue = useMemo(
    () => ({
      isHapticsEnabled,
      setIsHapticsEnabled,
      triggerImpact,
      triggerSelection,
      triggerNotification
    }),
    [
      isHapticsEnabled,
      setIsHapticsEnabled,
      triggerImpact,
      triggerSelection,
      triggerNotification
    ]
  )

  if (!isLoaded) {
    return null
  }

  return (
    <HapticsContext.Provider value={hapticsContextValue}>
      {children}
    </HapticsContext.Provider>
  )
}

/**
 * @returns {HapticsContextValue}
 */
export const useHapticsContext = () => useContext(HapticsContext)
