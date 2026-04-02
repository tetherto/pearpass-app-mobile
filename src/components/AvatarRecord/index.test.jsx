import { render } from '@testing-library/react-native'
import { ThemeProvider } from '@tetherto/pearpass-lib-ui-theme-provider/native'

import { AvatarRecord } from './index'

jest.mock('@tetherto/pear-apps-utils-avatar-initials', () => ({
  generateAvatarInitials: jest.fn(() => 'AB')
}))

jest.mock('@tetherto/pearpass-lib-ui-react-native-components', () => ({
  CheckIcon: (props) => <div testID="check-icon" {...props} />,
  StarIcon: (props) => <div testID="favorite-badge" {...props} />
}))

describe('AvatarRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders initials for a login record with a website', () => {
    const record = {
      type: 'login',
      data: { title: 'Test Record' },
      isFavorite: false
    }

    const { getByText } = render(
      <ThemeProvider>
        <AvatarRecord record={record} websiteDomain="https://example.com" />
      </ThemeProvider>
    )

    expect(getByText('AB')).toBeTruthy()
  })

  it('renders favorite badge when record is favorite', () => {
    const record = {
      type: 'login',
      data: { title: 'Fav Record' },
      isFavorite: true
    }

    const { getAllByTestId } = render(
      <ThemeProvider>
        <AvatarRecord record={record} websiteDomain="https://fav.com" />
      </ThemeProvider>
    )

    expect(getAllByTestId('favorite-badge').length).toBeGreaterThanOrEqual(1)
  })

  it('renders CheckIcon when record is selected', () => {
    const record = {
      type: 'login',
      data: { title: 'Selected Record' },
      isFavorite: false
    }

    const { getByTestId } = render(
      <ThemeProvider>
        <AvatarRecord
          record={record}
          isSelected
          websiteDomain="https://sel.com"
        />
      </ThemeProvider>
    )

    expect(getByTestId('check-icon')).toBeTruthy()
  })

  it('falls back to initials when websiteDomain is undefined', () => {
    const record = {
      type: 'login',
      data: { title: 'No Domain' },
      isFavorite: false
    }

    const { getByText } = render(
      <ThemeProvider>
        <AvatarRecord record={record} />
      </ThemeProvider>
    )

    expect(getByText('AB')).toBeTruthy()
  })
})
