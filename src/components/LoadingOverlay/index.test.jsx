import { render } from '@testing-library/react-native'

import { LoadingOverlay } from './index'

jest.mock('src/utils/colors', () => ({
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
