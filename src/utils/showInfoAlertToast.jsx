import { AlertMessage } from '@tetherto/pearpass-lib-ui-kit'
import Toast from 'react-native-toast-message'

import { TOAST_CONFIG } from '../constants/toast'

/**
 * @param {{
 *   theme: { colors: { backgroundSnackbar: string, colorOnPrimary: string } },
 *   description: string,
 *   actionText?: string,
 *   onAction?: () => void,
 *   bottomOffset?: number
 * }} options
 */
export const showInfoAlertToast = ({
  theme,
  description,
  actionText,
  onAction,
  bottomOffset = TOAST_CONFIG.BOTTOM_OFFSET
}) => {
  Toast.show({
    type: 'alertToast',
    props: {
      render: () => (
        <AlertMessage
          variant="info"
          size="small"
          backgroundColor={theme.colors.backgroundSnackbar}
          color={theme.colors.colorOnPrimary}
          title=""
          description={description}
          actionText={actionText}
          onAction={onAction}
        />
      )
    },
    position: 'bottom',
    bottomOffset
  })
}
