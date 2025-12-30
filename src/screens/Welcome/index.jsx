import { useEffect, useState } from 'react'

import { colors } from 'pearpass-lib-ui-theme-provider/native'
import { useUserData } from 'pearpass-lib-vault'
import { ActivityIndicator, View, Image } from 'react-native'

import { NAVIGATION_ROUTES } from '../../constants/navigation'
import { CreatePassword } from '../../containers/Auth/CreatePassword'
import { EnterPassword } from '../../containers/Auth/EnterPassword'
import { LoadVault } from '../../containers/Auth/LoadVault'
import { LockedScreen } from '../../containers/Auth/LockedScreen'
import { NewVault } from '../../containers/Auth/NewVault'
import { SelectVaultType } from '../../containers/Auth/SelectVaultType'
import { UnlockVault } from '../../containers/Auth/UnlockVault'
import { useBackHandler } from '../../hooks/useBackHandler'
import { logger } from '../../utils/logger'

const getWelcomeScreenContent = (state, vaultId) => {
  switch (state) {
    case NAVIGATION_ROUTES.CREATE_MASTER_PASSWORD:
      return <CreatePassword />
    case NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD:
      return <EnterPassword />
    case NAVIGATION_ROUTES.SELECT_OR_LOAD:
      return <SelectVaultType />
    case NAVIGATION_ROUTES.LOAD:
      return <LoadVault />
    case NAVIGATION_ROUTES.UNLOCK:
      return <UnlockVault vaultId={vaultId} />
    case NAVIGATION_ROUTES.CREDENTIALS:
      return <NewVault />
    case NAVIGATION_ROUTES.SCREEN_LOCKED:
      return <LockedScreen />
    default:
      return null
  }
}

export const Welcome = ({ route }) => {
  useBackHandler({
    shouldNotGoBack: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const {
    hasPasswordSet,
    masterPasswordStatus,
    refetch: refetchUser
  } = useUserData()

  const getState = () => {
    if (masterPasswordStatus?.isLocked) {
      return NAVIGATION_ROUTES.SCREEN_LOCKED
    }

    if (route?.params?.state) {
      return route.params.state
    }

    const state = hasPasswordSet
      ? NAVIGATION_ROUTES.ENTER_MASTER_PASSWORD
      : NAVIGATION_ROUTES.CREATE_MASTER_PASSWORD

    return state
  }

  const vaultId = route?.params?.vaultId

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true)
        await refetchUser()
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        logger.error('Error fetching user data:', error)
      }
    })()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../../assets/images/intro/authBackground.png')}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          width: '100%'
        }}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary400.mode1} />
      ) : (
        getWelcomeScreenContent(getState(), vaultId)
      )}
    </View>
  )
}
