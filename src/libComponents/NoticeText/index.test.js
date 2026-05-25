import { render } from '@testing-library/react-native'
import {
  ErrorFilled,
  Check,
  ReportProblem
} from '@tetherto/pearpass-lib-ui-kit/icons'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { NoticeText } from './index'

describe('NoticeText Component', () => {
  test('renders success type with Check and text', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ThemeProvider>
        <NoticeText text="Success message" type="success" />
      </ThemeProvider>
    )
    expect(getByText('Success message')).toBeTruthy()
    const icon = UNSAFE_getByType(Check)
    expect(icon).toBeTruthy()
  })

  test('renders error type with ErrorFilled and text', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ThemeProvider>
        <NoticeText text="Error message" type="error" />
      </ThemeProvider>
    )
    expect(getByText('Error message')).toBeTruthy()
    const icon = UNSAFE_getByType(ErrorFilled)
    expect(icon).toBeTruthy()
  })

  test('renders warning type with ReportProblem and text', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ThemeProvider>
        <NoticeText text="Warning message" type="warning" />
      </ThemeProvider>
    )
    expect(getByText('Warning message')).toBeTruthy()
    const icon = UNSAFE_getByType(ReportProblem)
    expect(icon).toBeTruthy()
  })

  test('matches snapshot for success type', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <NoticeText text="Snapshot Success" type="success" />
      </ThemeProvider>
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
