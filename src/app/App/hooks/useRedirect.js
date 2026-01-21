import { useEffect, useState } from 'react'

import { useUserData } from 'pearpass-lib-vault'

import { logger } from '../../../utils/logger'
import * as SplashScreen from '../../../utils/SplashScreen'

/**
 * Custom hook to determine the initial route for navigation.
 * @returns {{
 *  isLoading: boolean,
 *  initialRouteName: string | null
 * }} - An object containing the loading state and initial route name.
 */
export const useRedirect = () => {
  const { refetch: refetchUserData } = useUserData()

  const [isLoading, setIsLoading] = useState(true)

  const [initialRouteName, setInitialRouteName] = useState(null)

  useEffect(() => {
    let timeout

    void (async () => {
      try {
        const userData = await refetchUserData()

        if (!userData?.hasPasswordSet) {
          setInitialRouteName('Intro')
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
  }, [])

  return {
    isLoading,
    initialRouteName
  }
}
