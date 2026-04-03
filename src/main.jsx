import { Buffer } from 'buffer'

import { useEffect, useState } from 'react'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider as UIKitProvider } from '@tetherto/pearpass-lib-ui-kit'
import {
  colors,
  ThemeProvider
} from '@tetherto/pearpass-lib-ui-theme-provider/native'
import {
  setPearpassVaultClient,
  VaultProvider
} from '@tetherto/pearpass-lib-vault'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { App } from './app/App'
import { AutoLockTouchCapture } from './components/AutoLockHandler'
import { AutoLockProvider } from './context/AutoLockContext'
import { BottomSheetProvider } from './context/BottomSheetContext'
import { BottomSheetV2Provider } from './context/BottomSheetV2Context'
import { HapticsProvider } from './context/HapticsContext'
import { LoadingProvider } from './context/LoadingContext'
import { ModalProvider } from './context/ModalContext'
import { SharedFilterProvider } from './context/SharedFilterContext'
import { messages } from './locales/en/messages'
import * as SplashScreen from './utils/SplashScreen'
import { createPearpassVaultClient } from './worklet'

global.Buffer = global.Buffer || Buffer

SplashScreen.preventAutoHideAsync()

i18n.load('en', messages)
i18n.activate('en')

export const Main = () => {
  const [isPearPassReady, setIsPearPassReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const vaultClient = await createPearpassVaultClient({
        debugMode: process.env.NODE_ENV === 'development'
      })

      setPearpassVaultClient(vaultClient)

      setIsPearPassReady(true)
    }

    init()
  }, [])

  if (!isPearPassReady) {
    return null
  }

  return (
    <UIKitProvider>
      <StatusBar backgroundColor={colors.grey500.mode1} style="light" />

      <I18nProvider i18n={i18n}>
        <ThemeProvider>
          <HapticsProvider>
            <LoadingProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                  <VaultProvider>
                    <SharedFilterProvider>
                      <NavigationContainer>
                        <AutoLockProvider>
                          <AutoLockTouchCapture>
                            <ModalProvider>
                              <BottomSheetProvider>
                                <BottomSheetV2Provider>
                                  <App />
                                </BottomSheetV2Provider>
                              </BottomSheetProvider>
                            </ModalProvider>
                          </AutoLockTouchCapture>
                        </AutoLockProvider>
                      </NavigationContainer>
                    </SharedFilterProvider>
                  </VaultProvider>
                </SafeAreaProvider>
              </GestureHandlerRootView>
            </LoadingProvider>
          </HapticsProvider>
        </ThemeProvider>
      </I18nProvider>
    </UIKitProvider>
  )
}
