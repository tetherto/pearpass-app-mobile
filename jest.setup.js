require('react-native-reanimated').setUpTests()

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
