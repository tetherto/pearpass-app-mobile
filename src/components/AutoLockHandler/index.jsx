import { useCallback, useEffect, useRef } from 'react'

import { useNavigation } from '@react-navigation/native'
import { closeAllInstances, useUserData, useVaults } from 'pearpass-lib-vault'
import { View } from 'react-native'

import { useAutoLockContext } from '../../context/AutoLockContext'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useModal } from '../../context/ModalContext'
import { clearAllFileCache } from '../../utils/filesCache'
import { NAVIGATION_ROUTES } from '../../constants/navigation'

export const AutoLockHandler = ({ children }) => {
    const timerRef = useRef(null)

    const { collapse } = useBottomSheet()
    const { closeModal } = useModal()
    const { resetState } = useVaults()
    const navigation = useNavigation()
    const { refetch: refetchUser } = useUserData()
    const { shouldBypassAutoLock, autoLockTimeout, isAutoLockEnabled } =
        useAutoLockContext()

    const performLock = useCallback(async () => {
        const userData = await refetchUser()

        if (shouldBypassAutoLock || !userData?.hasPasswordSet) {
            return
        }

        collapse()
        closeModal()
        closeAllInstances()
        clearAllFileCache()
        navigation.navigate('Welcome', { state: NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD })
        resetState()
    }, [
        collapse,
        closeModal,
        navigation,
        refetchUser,
        resetState,
        shouldBypassAutoLock
    ])

    const resetAutoLockTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }

        if (
            shouldBypassAutoLock ||
            !isAutoLockEnabled ||
            autoLockTimeout === null
        ) {
            return
        }

        timerRef.current = setTimeout(performLock, autoLockTimeout)
    }, [performLock, shouldBypassAutoLock, isAutoLockEnabled, autoLockTimeout])

    useEffect(() => {
        resetAutoLockTimer()

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [resetAutoLockTimer])

    const handleTouchStart = () => {
        resetAutoLockTimer()
        return false
    }

    return (
        <View style={{ flex: 1 }} onStartShouldSetResponderCapture={handleTouchStart}>
            {children}
        </View>
    )
}

