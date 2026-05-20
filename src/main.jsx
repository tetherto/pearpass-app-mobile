import { Buffer } from 'buffer'

import { useEffect, useState } from 'react'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
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
import { Platform, StyleSheet, Text } from 'react-native'
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
import { VaultSelectorProvider } from './context/VaultSelectorContext'
import { messages } from './locales/en/messages'
import { runFirstLaunchCleanup } from './utils/firstLaunchCleanup'
import { logger } from './utils/logger'
import * as SplashScreen from './utils/SplashScreen'
import { createPearpassVaultClient } from './worklet'

global.Buffer = global.Buffer || Buffer

SplashScreen.preventAutoHideAsync()

i18n.load('en', messages)
i18n.activate('en')

export const Main = () => {
  const [isPearPassReady, setIsPearPassReady] = useState(false)
  const [initError, setInitError] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        // Cleanup must run BEFORE the worklet binds to `pearpass/` —
        // otherwise the recursive delete races the worklet's open FDs
        // and leaves the storage tree in a partially-deleted state.
        const cleanup = await runFirstLaunchCleanup()
        if (!cleanup.ok) {
          throw cleanup.error
        }

        const vaultClient = await createPearpassVaultClient({
          debugMode: process.env.NODE_ENV === 'development'
        })

        setPearpassVaultClient(vaultClient, {
          currentDeviceName: Platform.OS + ' ' + Platform.Version
        })
        setIsPearPassReady(true)
      } catch (error) {
        logger.error('PearPass init failed:', error)
        setInitError(error)
        setIsPearPassReady(false)
        SplashScreen.hideAsync()
      }
    }

    init()
  }, [])

  if (!isPearPassReady) {
    return (
      <UIKitProvider>
        <StatusBar backgroundColor={colors.grey500.mode1} style="light" />
        <GestureHandlerRootView style={styles.loadingScreen}>
          {initError ? (
            <>
              <Text style={styles.errorTitle}>PearPass failed to start</Text>
              <Text style={styles.errorMessage}>
                {String(initError?.message || initError)}
              </Text>
            </>
          ) : (
            <Text style={styles.loadingText}>Initializing…</Text>
          )}
        </GestureHandlerRootView>
      </UIKitProvider>
    )
  }

  return (
    <UIKitProvider>
      <StatusBar backgroundColor={colors.grey500.mode1} style="light" />

      <I18nProvider i18n={i18n}>
        <ThemeProvider>
          <HapticsProvider>
            <LoadingProvider>
              <GestureHandlerRootView style={styles.appRoot}>
                <SafeAreaProvider>
                  <VaultProvider>
                    <SharedFilterProvider>
                      <VaultSelectorProvider>
                        <NavigationContainer>
                          <AutoLockProvider>
                            <AutoLockTouchCapture>
                              <ModalProvider>
                                <BottomSheetProvider>
                                  <BottomSheetV2Provider>
                                    <BottomSheetModalProvider>
                                      <App />
                                    </BottomSheetModalProvider>
                                  </BottomSheetV2Provider>
                                </BottomSheetProvider>
                              </ModalProvider>
                            </AutoLockTouchCapture>
                          </AutoLockProvider>
                        </NavigationContainer>
                      </VaultSelectorProvider>
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

const styles = StyleSheet.create({
  appRoot: {
    flex: 1
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey500.mode1,
    paddingHorizontal: 24
  },
  errorTitle: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },
  errorMessage: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
    textAlign: 'center'
  },
  loadingText: {
    color: colors.white.mode1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600'
  }
})
