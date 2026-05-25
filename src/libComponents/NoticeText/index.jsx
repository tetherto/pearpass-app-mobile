import {
  ErrorFilled,
  Check,
  ReportProblem
} from '@tetherto/pearpass-lib-ui-kit/icons'

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
        return <Check width="14" height="14" />
      case 'error':
        return <ErrorFilled width="14" height="14" />
      case 'warning':
        return <ReportProblem width="14" height="14" />
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
