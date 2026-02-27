import { Buffer } from 'buffer'

import { render } from '@testing-library/react-native'
import { generateAvatarInitials } from 'pear-apps-utils-avatar-initials'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { AvatarRecord } from './index'

jest.mock('pear-apps-utils-avatar-initials', () => ({
  generateAvatarInitials: jest.fn(() => 'AB')
}))

jest.mock('pearpass-lib-ui-react-native-components', () => ({
  CheckIcon: (props) => <div testID="check-icon" {...props} />,
  StarIcon: (props) => <div testID="favorite-badge" {...props} />
}))

jest.mock('pearpass-lib-vault', () => ({
  getDefaultFavicon: jest.fn(),
  useFavicon: jest.fn(({ url }) => {
    const { getDefaultFavicon } = require('pearpass-lib-vault')
    const { extractDomainName } = require('../../utils/extractDomainName')

    if (!url) return { faviconSrc: null }

    const domain = extractDomainName(url)
    const buffer = getDefaultFavicon(domain)

    if (!buffer) return { faviconSrc: null }

    const base64 = buffer.toString('base64')
    return { faviconSrc: `data:image/png;base64,${base64}` }
  })
}))

jest.mock('../../utils/extractDomainName', () => ({
  extractDomainName: jest.fn(() => 'example.com')
}))

const { getDefaultFavicon } = require('pearpass-lib-vault')

const { extractDomainName } = require('../../utils/extractDomainName')

describe('AvatarRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders avatar image when favicon buffer is provided', () => {
    const mockBuffer = Buffer.from([137, 80, 78, 71]) // fake PNG header
    getDefaultFavicon.mockReturnValue(mockBuffer)

    const record = {
      type: 'login',
      data: { title: 'Test Record' },
      isFavorite: false
    }

    const { getByTestId } = render(
      <ThemeProvider>
        <AvatarRecord record={record} websiteDomain="https://example.com" />
      </ThemeProvider>
    )

    expect(extractDomainName).toHaveBeenCalledWith('https://example.com')
    expect(getDefaultFavicon).toHaveBeenCalledWith('example.com')
    expect(getByTestId('avatar-image')).toBeTruthy()
  })

  it('renders initials when favicon buffer is not provided', () => {
    getDefaultFavicon.mockReturnValue(null)

    const record = {
      type: 'login',
      data: { title: 'No Favicon Record' },
      isFavorite: false
    }

    const { getByText } = render(
      <ThemeProvider>
        <AvatarRecord record={record} websiteDomain="https://nofavicon.com" />
      </ThemeProvider>
    )

    expect(generateAvatarInitials).toHaveBeenCalledWith('No Favicon Record')
    expect(getByText('AB')).toBeTruthy()
  })

  it('renders favorite badge when record is favorite', () => {
    getDefaultFavicon.mockReturnValue(null)

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
    getDefaultFavicon.mockReturnValue(null)

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
    getDefaultFavicon.mockReturnValue(null)

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
