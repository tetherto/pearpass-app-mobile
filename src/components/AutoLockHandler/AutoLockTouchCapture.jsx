import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'

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
  const navigation = useNavigation()

  const updateActivityTimestamp = async () => {
    const now = Date.now()
    await setLastActivityAt(now)
  }

  const handleInteraction = () => {
    const state = navigation.getState()
    const currentRoute = state?.routes?.[state.index]?.name
    if (currentRoute === 'Welcome') {
      return false
    }

    updateActivityTimestamp()

    notifyInteraction()

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
