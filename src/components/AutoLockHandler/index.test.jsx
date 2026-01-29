import { render } from '@testing-library/react-native'
import { View } from 'react-native'

import { AutoLockTouchCapture } from './index'
import { useRouteHelper } from '../../app/App/hooks/useRouteHelper'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { setLastActivityAt } from '../../utils/autoLockStorage'

jest.mock('../../context/AutoLockContext', () => ({
  useAutoLockContext: jest.fn()
}))
jest.mock('../../app/App/hooks/useRouteHelper', () => ({
  useRouteHelper: jest.fn()
}))
jest.mock('../../utils/autoLockStorage', () => ({
  setLastActivityAt: jest.fn()
}))

describe('AutoLockTouchCapture', () => {
  const notifyInteractionMock = jest.fn()
  const getCurrentRouteMock = jest.fn()
  const isMasterPasswordScreenMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    useAutoLockContext.mockReturnValue({
      notifyInteraction: notifyInteractionMock
    })
    useRouteHelper.mockReturnValue({
      getCurrentRoute: getCurrentRouteMock,
      isMasterPasswordScreen: isMasterPasswordScreenMock
    })
  })

  it('records interaction and notifies when not on master password screen', () => {
    getCurrentRouteMock.mockReturnValue({ name: 'MainTabNavigator' })
    isMasterPasswordScreenMock.mockReturnValue(false)

    const { UNSAFE_getByType } = render(
      <AutoLockTouchCapture>
        <View />
      </AutoLockTouchCapture>
    )

    const handlerView = UNSAFE_getByType(View)
    const result = handlerView.props.onStartShouldSetResponderCapture()

    expect(result).toBe(false)
    expect(setLastActivityAt).toHaveBeenCalledWith(expect.any(Number))
    expect(notifyInteractionMock).toHaveBeenCalledWith(expect.any(Number))
  })

  it('does not notify on master password screen', () => {
    getCurrentRouteMock.mockReturnValue({ name: 'Welcome' })
    isMasterPasswordScreenMock.mockReturnValue(true)

    const { UNSAFE_getByType } = render(
      <AutoLockTouchCapture>
        <View />
      </AutoLockTouchCapture>
    )

    const handlerView = UNSAFE_getByType(View)
    const result = handlerView.props.onStartShouldSetResponderCapture()

    expect(result).toBe(false)
    expect(setLastActivityAt).not.toHaveBeenCalled()
    expect(notifyInteractionMock).not.toHaveBeenCalled()
  })
})
