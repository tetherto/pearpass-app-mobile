import { useEffect, useRef } from 'react'

import { useNavigation } from '@react-navigation/native'
import { closeAllInstances, useUserData, useVaults } from 'pearpass-lib-vault'
import { AppState } from 'react-native'

import { NAVIGATION_ROUTES } from '../../../constants/navigation'
import { useAutoLockContext } from '../../../context/AutoLockContext'
import { useBottomSheet } from '../../../context/BottomSheetContext'
import { useModal } from '../../../context/ModalContext'
import { clearAllFileCache } from '../../../utils/filesCache'

export const useAutoLock = () => {
  const appState = useRef(AppState.currentState)
  const bypassRef = useRef(false)

  const { collapse } = useBottomSheet()
  const { closeModal } = useModal()
  const { resetState } = useVaults()
  const navigation = useNavigation()
  const { refetch: refetchUser } = useUserData()
  const { shouldBypassAutoLock } = useAutoLockContext()

  useEffect(() => {
    bypassRef.current = shouldBypassAutoLock
  }, [shouldBypassAutoLock])

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        const previousAppState = appState.current

        appState.current = nextAppState

        if (
          previousAppState.match(/active/) &&
          nextAppState.match(/background/)
        ) {
          const userData = await refetchUser()

          if (bypassRef.current || !userData?.hasPasswordSet) {
            return
          }

          collapse()
          closeModal()
          closeAllInstances()
          clearAllFileCache()
          navigation.navigate('Welcome', {
            state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD
          })
          resetState()
        }
      }
    )

    return () => subscription.remove()
  }, [collapse, closeModal, resetState, navigation])
}
