import { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { isNightly } from '../constants/distribution'

const KEY = 'pearpass-log-config:logLevel'
export const LOG_LEVELS = ['off', 'error', 'warn', 'info', 'debug']
const SAFE_FALLBACK_LEVEL = 'off'

// First-run default: nightly testers get verbose logs without manually
// toggling Diagnostics; every other distribution stays silent until the
// user opts in. Once the user picks a level, AsyncStorage holds it.
const getDefaultLevel = () => (isNightly() ? 'debug' : 'off')

let cached = getDefaultLevel()
let initialized = false
const listeners = new Set()

export async function loadLogConfiguration() {
  if (initialized) return
  const stored = await AsyncStorage.getItem(KEY)
  cached = LOG_LEVELS.includes(stored) ? stored : getDefaultLevel()
  initialized = true
}

export function getLogLevelSync() {
  return cached
}

export async function setLogLevel(value) {
  const next = LOG_LEVELS.includes(value) ? value : SAFE_FALLBACK_LEVEL
  cached = next
  await AsyncStorage.setItem(KEY, next)
  for (const fn of listeners) fn(next)
}

export function subscribeLogLevel(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useLogLevel() {
  const [level, setLevel] = useState(cached)
  useEffect(() => {
    const listener = (next) => setLevel(next)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])
  return [level, setLogLevel]
}
