import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  getLogLevelSync,
  loadLogConfiguration,
  setLogLevel,
  subscribeLogLevel
} from './logConfigurationStorage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}))

describe('logConfigurationStorage', () => {
  test('getLogLevelSync returns "off" before load', () => {
    expect(getLogLevelSync()).toBe('off')
  })

  test('loadLogConfiguration reads from AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('info')
    await loadLogConfiguration()
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      'pearpass-log-config:logLevel'
    )
    expect(getLogLevelSync()).toBe('info')
  })

  test('setLogLevel writes valid level and updates cache', async () => {
    AsyncStorage.setItem.mockResolvedValueOnce()
    await setLogLevel('debug')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'pearpass-log-config:logLevel',
      'debug'
    )
    expect(getLogLevelSync()).toBe('debug')
  })

  test('setLogLevel coerces invalid input to "off"', async () => {
    AsyncStorage.setItem.mockResolvedValueOnce()
    await setLogLevel('garbage')
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'pearpass-log-config:logLevel',
      'off'
    )
    expect(getLogLevelSync()).toBe('off')
  })

  test('loadLogConfiguration is idempotent (subsequent calls noop)', async () => {
    AsyncStorage.getItem.mockClear()
    await loadLogConfiguration()
    expect(AsyncStorage.getItem).not.toHaveBeenCalled()
  })

  test('subscribeLogLevel fires on toggle and unsubscribe stops it', async () => {
    const fn = jest.fn()
    const unsubscribe = subscribeLogLevel(fn)
    await setLogLevel('warn')
    expect(fn).toHaveBeenCalledWith('warn')
    unsubscribe()
    await setLogLevel('error')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
