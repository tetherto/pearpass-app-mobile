import * as Haptics from 'expo-haptics'

import { useHapticsContext } from '../context/HapticsContext'

/**
 * @returns {{
 *  hapticButtonPrimary: () => void,
 *  hapticButtonSecondary: () => void,
 *  hapticToggle: () => void,
 *  hapticSuccess: () => void,
 *  hapticError: () => void,
 *  hapticWarning: () => void
 * }}
 */
export const useHapticFeedback = () => {
  const { triggerImpact, triggerSelection, triggerNotification } =
    useHapticsContext()

  return {
    hapticButtonPrimary: () =>
      triggerImpact(Haptics.ImpactFeedbackStyle.Medium),
    hapticButtonSecondary: () =>
      triggerImpact(Haptics.ImpactFeedbackStyle.Light),
    hapticToggle: () => triggerSelection(),
    hapticSuccess: () =>
      triggerNotification(Haptics.NotificationFeedbackType.Success),
    hapticError: () =>
      triggerNotification(Haptics.NotificationFeedbackType.Error),
    hapticWarning: () =>
      triggerNotification(Haptics.NotificationFeedbackType.Warning)
  }
}
