import { Buffer } from 'buffer'

import { useEffect, useState } from 'react'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { colors, ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'
import { setPearpassVaultClient, VaultProvider } from 'pearpass-lib-vault'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { App } from './app/App'
import { AutoLockTouchCapture } from './components/AutoLockHandler'
import { AutoLockProvider } from './context/AutoLockContext'
import { BottomSheetProvider } from './context/BottomSheetContext'
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
    <>
      <StatusBar backgroundColor={colors.grey500.mode1} style="light" />

      <I18nProvider i18n={i18n}>
        <ThemeProvider>
          <LoadingProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <VaultProvider>
                <SharedFilterProvider>
                  <NavigationContainer>
                    <AutoLockProvider>
                      <AutoLockTouchCapture>
                        <ModalProvider>
                          <BottomSheetProvider>
                            <App />
                          </BottomSheetProvider>
                        </ModalProvider>
                      </AutoLockTouchCapture>
                    </AutoLockProvider>
                  </NavigationContainer>
                </SharedFilterProvider>
              </VaultProvider>
            </GestureHandlerRootView>
          </LoadingProvider>
        </ThemeProvider>
      </I18nProvider>
    </>
  )
}
