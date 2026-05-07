import { useEffect, useState } from 'react'

import { useUserData } from '@tetherto/pearpass-lib-vault'

import { isV2 } from '../../../utils/designVersion'
import { hasOrphanedVaultData } from '../../../utils/hasOrphanedVaultData'
import { logger } from '../../../utils/logger'
import * as SplashScreen from '../../../utils/SplashScreen'
import { unsupportedFeaturesEnabled } from '../../../utils/unsupportedFeatures'

/**
 * Custom hook to determine the initial route for navigation.
 * @param {{ enabled?: boolean }} [options] - Pass `enabled: false` to defer
 * @returns {{
 *  isLoading: boolean,
 *  initialRouteName: string | null
 * }} - An object containing the loading state and initial route name.
 */
export const useRedirect = ({ enabled = true } = {}) => {
  const { refetch: refetchUserData } = useUserData()

  const [isLoading, setIsLoading] = useState(true)

  const [initialRouteName, setInitialRouteName] = useState(null)

  useEffect(() => {
    if (!enabled) return

    let timeout

    void (async () => {
      try {
        let userData = await refetchUserData()

        if (!userData) {
          userData = await refetchUserData()
        }

        if (!userData?.hasPasswordSet) {
          if (await hasOrphanedVaultData()) {
            logger.error(
              'Auto-redirect: hasPasswordSet=false but vault data exists on disk'
            )
            setInitialRouteName('Error')
            return
          }
          setInitialRouteName(isV2() ? 'OnboardingV2' : 'Intro')
          return
        }

        if (userData?.masterPasswordStatus?.isLocked) {
          setInitialRouteName('Welcome')
          return
        }

        if (isV2()) {
          setInitialRouteName(
            unsupportedFeaturesEnabled() ? 'AuthV2Pin' : 'AuthV2MasterPassword'
          )
          return
        }

        setInitialRouteName('Welcome')
      } catch (error) {
        logger.error('Auto-redirect error: ', error)
        setInitialRouteName('Error')
      } finally {
        // Hide splash screen after a short delay to ensure smooth transition
        timeout = setTimeout(() => {
          SplashScreen.hideAsync()
        }, 1000)

        setIsLoading(false)
      }
    })()

    return () => clearTimeout(timeout)
  }, [enabled])

  return {
    isLoading,
    initialRouteName
  }
}
