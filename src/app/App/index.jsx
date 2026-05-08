import { useEffect, useRef } from 'react'

import { rawTokens } from '@tetherto/pearpass-lib-ui-kit'
import { OtpRefreshProvider, useVaults } from '@tetherto/pearpass-lib-vault'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

import { Navigation } from '../Navigation'
import { useAutoLockWatcher } from './hooks/useAutoLockWatcher'
import { useRedirect } from './hooks/useRedirect'
import { ToastCard } from '../../components/ToastCard'
import { UpdateModalContent } from '../../containers/Modal/UpdateModalContent'
import { useBottomSheet } from '../../context/BottomSheetContext'
import { useVaultAccessRevoked } from '../../hooks/useVaultAccessRevoked'
import { useVersionCheck } from '../../hooks/useVersionCheck'

export const App = () => {
  useAutoLockWatcher()
  const { expand } = useBottomSheet()
  const { needsUpdate } = useVersionCheck()
  const hasOpenedUpdateModal = useRef(false)

  useEffect(() => {
    if (needsUpdate && !hasOpenedUpdateModal.current) {
      hasOpenedUpdateModal.current = true
      expand({ children: <UpdateModalContent />, locked: true })
    }
  }, [needsUpdate])

  const { triggerAccessRevoked } = useVaultAccessRevoked()
  const { data: vaultsForDevTrigger } = useVaults()
  useEffect(() => {
    // Dev hook: action-bus mechanism is not implemented yet, so for now the
    // delete handler is fired manually from a dev console or test harness.
    const list = vaultsForDevTrigger ?? []
    const devTrigger = (vaultIdOrName, deviceName) => {
      const match =
        list.find((v) => v.id === vaultIdOrName) ??
        list.find((v) => v.name === vaultIdOrName)
      if (!match) {
        // eslint-disable-next-line no-console
        console.error(
          `[pearpassTriggerAccessRevoked] no vault matched "${vaultIdOrName}". Available:`,
          list.map((v) => ({ id: v.id, name: v.name }))
        )
        return
      }
      return triggerAccessRevoked(match.id, deviceName)
    }
    // eslint-disable-next-line no-underscore-dangle
    globalThis.__pearpassTriggerAccessRevoked = devTrigger
    return () => {
      // eslint-disable-next-line no-underscore-dangle
      delete globalThis.__pearpassTriggerAccessRevoked
    }
  }, [triggerAccessRevoked, vaultsForDevTrigger])

  const { initialRouteName, isLoading } = useRedirect()

  if (isLoading) {
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
