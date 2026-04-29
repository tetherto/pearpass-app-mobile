import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { act, render } from '@testing-library/react-native'
import { AppState } from 'react-native'
import Toast from 'react-native-toast-message'

import { LockedScreenV2 } from './LockedScreenV2'
import { messages } from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

const mockReplace = jest.fn()
const mockUseKeyboardVisibility = jest.fn(() => ({
  isKeyboardVisible: false,
  keyboardHeight: 0
}))
const mockRefreshMasterPasswordStatus = jest.fn()
const mockUseUserData = jest.fn()

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace
  })
}))

jest.mock('../../hooks/useKeyboardVisibility', () => ({
  useKeyboardVisibility: (...args) => mockUseKeyboardVisibility(...args)
}))

jest.mock('@tetherto/pearpass-lib-vault', () => ({
  useUserData: () => mockUseUserData()
}))

/** Mirrors `useCountDown` from pear-apps without importing the package (Jest ESM chain). */
jest.mock('@tetherto/pear-apps-lib-ui-react-hooks', () => {
  const ReactImport = require('react')
  const MS_PER_SECOND = 1000
  const SECONDS_PER_MINUTE = 60

  return {
    useCountDown: ({ initialSeconds, onFinish }) => {
      const [timeLeft, setTimeLeft] = ReactImport.useState(initialSeconds)
      const onFinishRef = ReactImport.useRef(onFinish)

      ReactImport.useEffect(() => {
        onFinishRef.current = onFinish
      }, [onFinish])

      ReactImport.useEffect(() => {
        setTimeLeft(initialSeconds)

        const intervalId = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(intervalId)
              onFinishRef.current?.()
              return 0
            }
            return prev - 1
          })
        }, MS_PER_SECOND)

        return () => {
          clearInterval(intervalId)
        }
      }, [initialSeconds])

      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / SECONDS_PER_MINUTE)
        const remainingSeconds = seconds % SECONDS_PER_MINUTE
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
      }

      return formatTime(timeLeft)
    }
  }
})

const rawTokensMock = {
  spacing4: 4,
  spacing6: 6,
  spacing8: 8,
  spacing10: 10,
  spacing16: 16,
  spacing20: 20,
  spacing24: 24,
  spacing40: 40,
  spacing60: 60,
  fontSize14: 14,
  fontPrimary: 'Inter',
  weightMedium: '500'
}

jest.mock('@tetherto/pearpass-lib-ui-kit', () => {
  const RN = require('react-native')

  return {
    PageHeader: ({ title }) => (
      <RN.Text testID="locked-screen-page-header">{title}</RN.Text>
    ),
    Text: ({ children, testID }) => (
      <RN.Text testID={testID}>{children}</RN.Text>
    ),
    useTheme: () => ({
      theme: {
        colors: {
          colorTextSecondary: '#888',
          colorBorderPrimary: '#ccc',
          colorPrimary: '#0f0'
        }
      }
    }),
    rawTokens: rawTokensMock
  }
})

jest.mock('@tetherto/pearpass-lib-ui-kit/icons', () => ({
  WatchLater: () => {
    const RN = require('react-native')
    return <RN.View testID="watch-later-icon" />
  }
}))

jest.mock('../../screens/OnboardingV2/components/OnboardingLayout', () => {
  const RN = require('react-native')

  return {
    OnboardingLayout: ({
      children,
      avoidBottomInset,
      showLogo,
      topGradient
    }) => (
      <RN.View
        testID="onboarding-layout"
        accessibilityState={{
          avoidBottomInset,
          showLogo: String(showLogo),
          topGradient: String(topGradient)
        }}
      >
        {children}
      </RN.View>
    )
  }
})

jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn()
  }
}))

let mockUnsupportedFeaturesEnabled = false

jest.mock('../../utils/unsupportedFeatures', () => ({
  unsupportedFeaturesEnabled: () => mockUnsupportedFeaturesEnabled
}))

const renderLockedScreen = () =>
  render(
    <I18nProvider i18n={i18n}>
      <LockedScreenV2 />
    </I18nProvider>
  )

describe('LockedScreenV2', () => {
  let appStateHandler
  let appStateRemove

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()

    mockUnsupportedFeaturesEnabled = false

    mockUseKeyboardVisibility.mockReturnValue({
      isKeyboardVisible: false,
      keyboardHeight: 0
    })

    mockRefreshMasterPasswordStatus.mockResolvedValue({ isLocked: true })

    mockUseUserData.mockReturnValue({
      masterPasswordStatus: { lockoutRemainingMs: 125000 },
      refreshMasterPasswordStatus: mockRefreshMasterPasswordStatus
    })

    appStateRemove = jest.fn()
    appStateHandler = undefined

    jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((_event, handler) => {
        appStateHandler = handler
        return { remove: appStateRemove }
      })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it('renders the lockout title, explanation, and formatted countdown', () => {
    const { getByTestId, getByText } = renderLockedScreen()

    expect(getByTestId('locked-screen-page-header').props.children).toBe(
      'PearPass locked'
    )
    expect(getByText('Too many failed attempts.')).toBeTruthy()
    expect(
      getByText('For your security, access is temporarily locked.')
    ).toBeTruthy()
    expect(getByText('Try again in')).toBeTruthy()
    expect(getByText('2:05').props.children).toBe('2:05')
    expect(getByTestId('watch-later-icon')).toBeTruthy()
  })

  it('passes keyboard and logo props to OnboardingLayout', () => {
    const { getByTestId, rerender } = renderLockedScreen()

    expect(getByTestId('onboarding-layout').props.accessibilityState).toEqual(
      expect.objectContaining({
        avoidBottomInset: false,
        showLogo: 'true',
        topGradient: 'true'
      })
    )

    mockUseKeyboardVisibility.mockReturnValue({
      isKeyboardVisible: true,
      keyboardHeight: 120
    })
    rerender(
      <I18nProvider i18n={i18n}>
        <LockedScreenV2 />
      </I18nProvider>
    )

    expect(getByTestId('onboarding-layout').props.accessibilityState).toEqual(
      expect.objectContaining({
        avoidBottomInset: true,
        showLogo: 'false',
        topGradient: 'true'
      })
    )
  })

  it('refreshes master password status when the app becomes active', () => {
    renderLockedScreen()
    expect(appStateHandler).toEqual(expect.any(Function))

    act(() => {
      appStateHandler('active')
    })

    expect(mockRefreshMasterPasswordStatus).toHaveBeenCalledTimes(1)
  })

  it('does not refresh on non-active AppState transitions', () => {
    renderLockedScreen()

    act(() => {
      appStateHandler('background')
    })

    expect(mockRefreshMasterPasswordStatus).not.toHaveBeenCalled()
  })

  it('removes the AppState subscription on unmount', () => {
    const { unmount } = renderLockedScreen()
    unmount()
    expect(appStateRemove).toHaveBeenCalledTimes(1)
  })

  it('when the countdown ends and the vault is unlocked, navigates to the v2 master password screen and shows a toast', async () => {
    jest.useFakeTimers()

    mockRefreshMasterPasswordStatus.mockResolvedValue({ isLocked: false })

    mockUseUserData.mockReturnValue({
      masterPasswordStatus: { lockoutRemainingMs: 2000 },
      refreshMasterPasswordStatus: mockRefreshMasterPasswordStatus
    })

    const { getByText } = renderLockedScreen()

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(mockRefreshMasterPasswordStatus).toHaveBeenCalled()
    expect(mockReplace).toHaveBeenCalledWith('AuthV2MasterPassword')
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'baseToast',
        position: 'bottom',
        bottomOffset: 100
      })
    )
    expect(getByText('0:00').props.children).toBe('0:00')

    jest.useRealTimers()
  })

  it('when the countdown ends with unsupported features enabled, navigates to the pin screen', async () => {
    jest.useFakeTimers()

    mockUnsupportedFeaturesEnabled = true
    mockRefreshMasterPasswordStatus.mockResolvedValue({ isLocked: false })

    mockUseUserData.mockReturnValue({
      masterPasswordStatus: { lockoutRemainingMs: 2000 },
      refreshMasterPasswordStatus: mockRefreshMasterPasswordStatus
    })

    renderLockedScreen()

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(mockReplace).toHaveBeenCalledWith('AuthV2Pin')

    jest.useRealTimers()
  })

  it('when the countdown ends but the vault stays locked, does not navigate or toast', async () => {
    jest.useFakeTimers()

    mockRefreshMasterPasswordStatus.mockResolvedValue({ isLocked: true })

    mockUseUserData.mockReturnValue({
      masterPasswordStatus: { lockoutRemainingMs: 2000 },
      refreshMasterPasswordStatus: mockRefreshMasterPasswordStatus
    })

    renderLockedScreen()

    await act(async () => {
      jest.advanceTimersByTime(2000)
      await Promise.resolve()
    })

    expect(mockRefreshMasterPasswordStatus).toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
    expect(Toast.show).not.toHaveBeenCalled()

    jest.useRealTimers()
  })
})
