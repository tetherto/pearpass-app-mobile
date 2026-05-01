import { useEffect, useRef } from 'react'

import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { OtpRefreshProvider } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import { Navigation } from '../Navigation'
import { useAutoLockWatcher } from './hooks/useAutoLockWatcher'
import { useRedirect } from './hooks/useRedirect'
import { ToastCard } from '../../components/ToastCard'
import { UpdateModalContent } from '../../containers/Modal/UpdateModalContent'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useFirstLaunchCleanUp } from '../../hooks/useFirstLaunchCleanUp'
import { useVersionCheck } from '../../hooks/useVersionCheck'

export const App = () => {
  useAutoLockWatcher()
  const { expand } = useBottomSheet()
  // TEMP: force modal for pixel-perfect redesign — REVERT BEFORE COMMIT
  useVersionCheck()
  const needsUpdate = true
  const hasOpenedUpdateModal = useRef(false)

  const isFirstLaunchCleanupReady = useFirstLaunchCleanUp()

  useEffect(() => {
    if (needsUpdate && !hasOpenedUpdateModal.current) {
      hasOpenedUpdateModal.current = true
      expand({ children: <UpdateModalContent />, locked: true })
    }
  }, [needsUpdate])

  const { initialRouteName, isLoading } = useRedirect()

  if (isLoading || !isFirstLaunchCleanupReady) {
    return null
  }

  return (
    <>
      <OtpRefreshProvider>
        <Navigation initialRouteName={initialRouteName} />
      </OtpRefreshProvider>

      <Toast
        config={{
          baseToast: ({ text1, renderLeadingIcon }) => (
            <ToastCard text1={text1} renderLeadingIcon={renderLeadingIcon} />
          ),
          alertToast: ({ props }) => (
            <View
              style={{ width: '100%', paddingHorizontal: rawTokens.spacing16 }}
            >
              {props?.render?.()}
            </View>
          )
        }}
      />
    </>
  )
}
