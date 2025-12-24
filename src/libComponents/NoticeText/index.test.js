import { render } from '@testing-library/react-native'
import {
  ErrorIcon,
  OkayIcon,
  YellowErrorIcon
} from 'pearpass-lib-ui-react-native-components'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { NoticeText } from './index'

describe('NoticeText Component', () => {
  test('renders success type with OkayIcon and text', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ThemeProvider>
        <NoticeText text="Success message" type="success" />
      </ThemeProvider>
    )
    expect(getByText('Success message')).toBeTruthy()
    const icon = UNSAFE_getByType(OkayIcon)
    expect(icon).toBeTruthy()
  })

  test('renders error type with ErrorIcon and text', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ThemeProvider>
        <NoticeText text="Error message" type="error" />
      </ThemeProvider>
    )
    expect(getByText('Error message')).toBeTruthy()
    const icon = UNSAFE_getByType(ErrorIcon)
    expect(icon).toBeTruthy()
  })

  test('renders warning type with YellowErrorIcon and text', () => {
    const { getByText, UNSAFE_getByType } = render(
      <ThemeProvider>
        <NoticeText text="Warning message" type="warning" />
      </ThemeProvider>
    )
    expect(getByText('Warning message')).toBeTruthy()
    const icon = UNSAFE_getByType(YellowErrorIcon)
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

  test('passes testID to native component', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <NoticeText testID="notice-text" text="Test message" type="success" />
      </ThemeProvider>
    )
    expect(getByTestId('notice-text')).toBeTruthy()
  })
})
