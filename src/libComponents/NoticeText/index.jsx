import {
  ErrorIcon,
  OkayIcon,
  YellowErrorIcon
} from 'pearpass-lib-ui-react-native-components'

import { NoticeTextComponent, NoticeTextWrapper } from './styles'

/**
 * @param {{
 *  text: string;
 *  type: 'success' | 'error' | 'warning';
 *  testID?: string
 * }} props
 */
export const NoticeText = ({ text, type = 'success', testID }) => {
  const getIconByType = () => {
    switch (type) {
      case 'success':
        return <OkayIcon size="14" />
      case 'error':
        return <ErrorIcon size="14" />
      case 'warning':
        return <YellowErrorIcon size="14" />
      default:
        return null
    }
  }

  return (
    <NoticeTextWrapper testID={testID}>
      {getIconByType()}
      <NoticeTextComponent type={type}>{text}</NoticeTextComponent>
    </NoticeTextWrapper>
  )
}
