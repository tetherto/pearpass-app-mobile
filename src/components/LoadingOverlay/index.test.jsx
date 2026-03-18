import { render } from '@testing-library/react-native'

import { LoadingOverlay } from './index'

jest.mock('@tetherto/pearpass-lib-ui-theme-provider/native', () => ({
  colors: {
    primary400: {
      mode1: '#testColor'
    }
  }
}))

describe('LoadingOverlay', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<LoadingOverlay />)
    expect(toJSON()).toMatchSnapshot()
  })
})
