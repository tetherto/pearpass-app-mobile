import { useEffect, useRef } from 'react'

import Toast from 'react-native-toast-message'

import { Navigation } from '../Navigation'
import { useAutoLockWatcher } from './hooks/useAutoLockWatcher'
import { useRedirect } from './hooks/useRedirect'
import { ToastCard } from '../../components/ToastCard'
import { UpdateModalContent } from '../../containers/Modal/UpdateModalContent'
import { useModal } from '../../context/ModalContext'
import { useFirstLaunchCleanUp } from '../../hooks/useFirstLaunchCleanUp'
import { useVersionCheck } from '../../hooks/useVersionCheck'

export const App = () => {
  useAutoLockWatcher()
  const { openModal } = useModal()
  const { needsUpdate } = useVersionCheck()
  const hasOpenedUpdateModal = useRef(false)

  useFirstLaunchCleanUp()

  useEffect(() => {
    if (needsUpdate && !hasOpenedUpdateModal.current) {
      hasOpenedUpdateModal.current = true
      openModal(<UpdateModalContent />, { preventClose: true })
    }
  }, [needsUpdate])

  const { initialRouteName, isLoading } = useRedirect()

  if (isLoading) {
    return null
  }

  return (
    <>
      <Navigation initialRouteName={initialRouteName} />

      <Toast
        config={{
          baseToast: ({ text1, renderLeadingIcon }) => (
            <ToastCard text1={text1} renderLeadingIcon={renderLeadingIcon} />
          )
        }}
      />
    </>
  )
}
