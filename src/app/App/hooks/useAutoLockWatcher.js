import { useCallback, useEffect, useRef } from 'react'

import { useNavigation } from '@react-navigation/native'
import { closeAllInstances, useUserData, useVaults } from 'pearpass-lib-vault'
import { AppState } from 'react-native'

import { useRouteHelper } from './useRouteHelper'
import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useModal } from '../../../context/ModalContext'
import {
  getLastActivityAt,
  setLastActivityAt
} from '../../../utils/autoLockStorage'
import { clearAllFileCache } from '../../../utils/filesCache'

/**
 * Hook responsible for monitoring user inactivity and handling auto-lock logic.
 */
export const useAutoLockWatcher = () => {
  const timerRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const lockInProgressRef = useRef(false)
  const appStateRef = useRef(AppState.currentState)
  const { getCurrentRoute, isMasterPasswordScreen } = useRouteHelper()
  const { collapse } = useBottomSheet()
  const { closeModal } = useModal()
  const { resetState } = useVaults()
  const navigation = useNavigation()
  const { refetch: refetchUser, hasPasswordSet } = useUserData()
  const {
    shouldBypassAutoLock,
    autoLockTimeout,
    isAutoLockEnabled,
    registerInteractionListener
  } = useAutoLockContext()

  const isAutoLockActive =
    hasPasswordSet &&
    isAutoLockEnabled &&
    !shouldBypassAutoLock &&
    autoLockTimeout !== null

  const performLock = useCallback(async () => {
    const currentRoute = getCurrentRoute()
    if (
      isMasterPasswordScreen(currentRoute) ||
      lockInProgressRef.current ||
      !isAutoLockActive
    ) {
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
    getCurrentRoute,
    isAutoLockActive,
    isMasterPasswordScreen,
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

  const resetAutoLockTimer = useCallback(
    (overrideLastActivity = null) => {
      const currentRoute = getCurrentRoute()
      if (!isAutoLockActive || !currentRoute) {
        clearAutoLockTimer()
        return
      }

      if (isMasterPasswordScreen(currentRoute) || lockInProgressRef.current) {
        clearAutoLockTimer()
        return
      }

      clearAutoLockTimer()

      const lastActivity = overrideLastActivity ?? lastActivityRef.current

      lastActivityRef.current = lastActivity

      const elapsed = Date.now() - lastActivity
      const remaining = autoLockTimeout - elapsed

      if (remaining <= 0) {
        performLock()
        return
      }
      timerRef.current = setTimeout(performLock, remaining)
    },
    [
      autoLockTimeout,
      isAutoLockActive,
      performLock,
      getCurrentRoute,
      isMasterPasswordScreen,
      clearAutoLockTimer
    ]
  )

  useEffect(() => {
    if (!registerInteractionListener || !isAutoLockActive) return

    const handler = (ts) => resetAutoLockTimer(ts)
    registerInteractionListener(handler)

    return () => {
      registerInteractionListener(null)
    }
  }, [registerInteractionListener, resetAutoLockTimer, isAutoLockActive])

  /**
   * Auto-lock setting changed → reset inactivity window
   */
  useEffect(() => {
    if (!isAutoLockActive) {
      clearAutoLockTimer()
      return
    }

    const resetFromNow = async () => {
      const now = Date.now()
      lastActivityRef.current = now
      await setLastActivityAt(now)
      resetAutoLockTimer(now)
    }

    resetFromNow()
  }, [resetAutoLockTimer, isAutoLockActive, clearAutoLockTimer])

  /**
   * Background → foreground handling
   */
  useEffect(() => {
    if (!isAutoLockActive) return

    const handleAppStateChange = async (nextState) => {
      const prev = appStateRef.current
      appStateRef.current = nextState

      if (nextState === 'active' && prev !== 'active') {
        const stored = await getLastActivityAt()
        const lastActivity = stored ?? Date.now()

        lastActivityRef.current = lastActivity
        resetAutoLockTimer(lastActivity)
      }
    }

    const sub = AppState.addEventListener('change', handleAppStateChange)
    return () => sub.remove()
  }, [resetAutoLockTimer, isAutoLockActive])

  useEffect(() => {
    if (!isAutoLockActive) return

    const initActivity = async () => {
      const stored = await getLastActivityAt()
      if (!stored) {
        const now = Date.now()
        lastActivityRef.current = now
        await setLastActivityAt(now)
      } else {
        lastActivityRef.current = stored
      }
    }

    initActivity()
  }, [isAutoLockActive])

  useEffect(() => {
    if (!isAutoLockActive) return

    const route = getCurrentRoute()

    if (!isMasterPasswordScreen(route)) {
      lockInProgressRef.current = false
      resetAutoLockTimer(Date.now())
    }
  }, [
    getCurrentRoute,
    isMasterPasswordScreen,
    resetAutoLockTimer,
    isAutoLockActive
  ])

  useEffect(
    () => () => {
      clearAutoLockTimer()
    },
    [clearAutoLockTimer]
  )

  return null
}
