import { useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'

import { NAVIGATION_ROUTES } from '../../../constants/navigation'
/**
 * React hook providing utility functions for navigation route handling.
 *
 * Exposes:
 * - getCurrentRoute: Retrieves the current navigation route object.
 * - isMasterPasswordScreen: Checks if a given route is the master password entry screen.
 *
 * @returns {{
 *   getCurrentRoute: () => object,
 *   isMasterPasswordScreen: (route: object) => boolean,
 * }}
 */

export const useRouteHelper = () => {
  const navigation = useNavigation()

  const getCurrentRoute = useCallback(() => {
    const state = navigation.getState()
    return state?.routes?.[state.index]
  }, [navigation])

  // on cold start we don't have a route.params, cold start === ENTER_MASTER_PASSWORD
  const isMasterPasswordScreen = useCallback(
    (route) =>
      route?.name === 'Welcome' &&
      (route?.params?.state === NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD ||
        !route?.params),
    []
  )

  return { getCurrentRoute, isMasterPasswordScreen }
}
