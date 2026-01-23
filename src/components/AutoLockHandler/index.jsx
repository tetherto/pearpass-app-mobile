import { useCallback, useEffect, useRef } from 'react'

import { useNavigation } from '@react-navigation/native'
import { closeAllInstances, useUserData, useVaults } from 'pearpass-lib-vault'
import { AppState, View } from 'react-native'

import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import {
  getLastActivityAt,
  setLastActivityAt
} from '../../utils/autoLockStorage'
import { clearAllFileCache } from '../../utils/filesCache'
/**
 * AutoLockHandler component manages auto-lock logic for the app.
 * It listens to user activity and application state changes to determine
 * when to auto-lock the vault and return users to the appropriate screen.
 *
 * - Listens to user interactions and app backgrounding/foregrounding.
 * - Triggers lock after a period of inactivity defined by `autoLockTimeout`.
 * - Calls closeAllInstances, clears sensitive app data and navigates user to the Welcome screen.
 * - Skips locking if `shouldBypassAutoLock` is enabled or if no password is set.
 *
 * Context dependencies:
 * - AutoLockContext: autoLockTimeout, shouldBypassAutoLock, isAutoLockEnabled
 * - VaultsContext: resetState
 * - BottomSheetContext: collapse
 * - ModalContext: closeModal
 * - UserData query: refetch to check for password status
 *
 * Utilizes:
 * - autoLockStorage: getLastActivityAt, setLastActivityAt
 * - filesCache: clearAllFileCache
 * - React Navigation for route management and determining current screen
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components which will wrap the app content
 * @returns {React.ReactNode}
 */

export const AutoLockHandler = ({ children }) => {
  const timerRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const lockInProgressRef = useRef(false)
  const appStateRef = useRef(AppState.currentState)

  const { collapse } = useBottomSheet()
  const { closeModal } = useModal()
  const { resetState } = useVaults()
  const navigation = useNavigation()
  const { refetch: refetchUser } = useUserData()

  const { shouldBypassAutoLock, autoLockTimeout, isAutoLockEnabled } =
    useAutoLockContext()

  const performLock = useCallback(async () => {
    const state = navigation.getState()
    const currentRoute = state.routes[state.index]?.name
    if (currentRoute === 'Welcome') {
      return
    }
    if (lockInProgressRef.current) {
      return
    }

    lockInProgressRef.current = true
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    let userData
    try {
      userData = await refetchUser()
    } catch {
      lockInProgressRef.current = false
      return
    }

    if (shouldBypassAutoLock || !userData?.hasPasswordSet) {
      lockInProgressRef.current = false
      return
    }

    collapse()
    closeModal()
    closeAllInstances()
    clearAllFileCache()

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Welcome',
          params: { state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD }
        }
      ]
    })

    resetState()
  }, [
    collapse,
    closeModal,
    navigation,
    refetchUser,
    resetState,
    shouldBypassAutoLock
  ])

  const clearAutoLockTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const resetAutoLockTimer = useCallback(async () => {
    if (
      shouldBypassAutoLock ||
      !isAutoLockEnabled ||
      autoLockTimeout === null
    ) {
      return
    }

    const state = navigation.getState()
    const currentRoute = state.routes[state.index]?.name
    if (currentRoute === 'Welcome' || lockInProgressRef.current) {
      clearAutoLockTimer()
      return
    }

    clearAutoLockTimer()

    let stored = await getLastActivityAt()
    if (stored === null) {
      stored = lastActivityRef.current
      await setLastActivityAt(stored)
    }
    lastActivityRef.current = stored
    const lastActivity = stored

    const elapsed = Date.now() - lastActivity
    const remaining = autoLockTimeout - elapsed
    if (remaining <= 0) {
      performLock()
      return
    }

    timerRef.current = setTimeout(performLock, remaining)
  }, [
    autoLockTimeout,
    isAutoLockEnabled,
    performLock,
    shouldBypassAutoLock,
    clearAutoLockTimer
  ])

  useEffect(() => {
    resetAutoLockTimer()

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [resetAutoLockTimer])
  /**
   * Auto-lock setting changed → reset inactivity window
   */
  useEffect(() => {
    if (
      shouldBypassAutoLock ||
      !isAutoLockEnabled ||
      autoLockTimeout === null
    ) {
      return
    }

    const resetFromNow = async () => {
      const now = Date.now()
      lastActivityRef.current = now
      await setLastActivityAt(now)
      resetAutoLockTimer()
    }

    resetFromNow()
  }, [
    autoLockTimeout,
    isAutoLockEnabled,
    resetAutoLockTimer,
    shouldBypassAutoLock
  ])

  /**
   * Background → foreground handling
   */
  useEffect(() => {
    const handleAppStateChange = async (nextState) => {
      const prev = appStateRef.current
      appStateRef.current = nextState

      // app comes to foreground
      if (nextState === 'active' && prev !== 'active') {
        resetAutoLockTimer()
      }
    }

    const sub = AppState.addEventListener('change', handleAppStateChange)

    return () => sub.remove()
  }, [resetAutoLockTimer])

  const handleInteraction = () => {
    const state = navigation.getState()
    const currentRoute = state.routes[state.index]?.name
    if (currentRoute === 'Welcome') {
      return false
    }

    if (lockInProgressRef.current) {
      lockInProgressRef.current = false
    }

    const now = Date.now()
    lastActivityRef.current = now
    setLastActivityAt(now)

    resetAutoLockTimer()
    return false
  }

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponderCapture={handleInteraction}
    >
      {children}
    </View>
  )
}
