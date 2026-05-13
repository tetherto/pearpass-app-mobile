require('react-native-reanimated').setUpTests()

// Since many components use clipboard and secure store, we mock them here
// Developer can overwrite them in their test files if needed.
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
  getStringAsync: jest.fn(() => Promise.resolve('')),
  hasStringAsync: jest.fn(() => Promise.resolve(false)),
  setString: jest.fn(),
  getString: jest.fn(() => '')
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve())
}))


jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy'
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error'
  }
}))

jest.mock('./src/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    hapticButtonPrimary: jest.fn(),
    hapticButtonSecondary: jest.fn(),
    hapticToggle: jest.fn(),
    hapticSuccess: jest.fn(),
    hapticError: jest.fn(),
    hapticWarning: jest.fn()
  })
}))

jest.mock('./src/context/HapticsContext', () => ({
  useHapticsContext: () => ({
    isHapticsEnabled: true,
    setIsHapticsEnabled: jest.fn(),
    triggerImpact: jest.fn(),
    triggerSelection: jest.fn(),
    triggerNotification: jest.fn()
  }),
  HapticsProvider: ({ children }) => children
}))

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('expo-file-system/next', () => ({
  File: jest.fn().mockImplementation(() => ({
    exists: false,
    size: 0,
    create: jest.fn(),
    delete: jest.fn(),
    write: jest.fn(),
    textSync: jest.fn(() => ''),
    open: jest.fn(() => ({
      offset: 0,
      size: 0,
      writeBytes: jest.fn(),
      close: jest.fn()
    }))
  })),
  Paths: { cache: { uri: 'file:///mock-cache/' } }
}))

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(() => Promise.resolve())
}))

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { extra: {} } }
}))

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  reactNavigationIntegration: jest.fn(() => ({}))
}))
