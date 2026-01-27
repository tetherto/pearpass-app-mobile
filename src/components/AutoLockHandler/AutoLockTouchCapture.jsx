import { View } from 'react-native'

import { useRouteHelper } from '../../app/App/hooks/useRouteHelper'
import { useAutoLockContext } from '../../context/AutoLockContext'
import { setLastActivityAt } from '../../utils/autoLockStorage'

/**
 * Component that wraps children to capture touch interactions.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped.
 * @returns {JSX.Element} The wrapper View component.
 */
export const AutoLockTouchCapture = ({ children }) => {
  const { notifyInteraction } = useAutoLockContext()
  const { getCurrentRoute, isMasterPasswordScreen } = useRouteHelper()
  const updateActivityTimestamp = async () => {
    const now = Date.now()
    await setLastActivityAt(now)
  }

  const handleInteraction = () => {
    const currentRoute = getCurrentRoute()
    if (isMasterPasswordScreen(currentRoute)) {
      return false
    }

    updateActivityTimestamp()

    notifyInteraction(Date.now())

    return false
  }

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponderCapture={handleInteraction}
    >
      {children}
    </View>
  )
}
