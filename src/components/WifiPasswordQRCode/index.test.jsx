import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, waitFor } from '@testing-library/react-native'
import { ThemeProvider } from 'pearpass-lib-ui-theme-provider/native'

import { WifiPasswordQRCode } from './index'
import messages from '../../locales/en/messages'

i18n.load('en', messages)
i18n.activate('en')

jest.mock('pear-apps-utils-qr', () => ({
  generateQRCodeSVG: jest.fn()
}))

jest.mock('../../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}))

jest.mock('react-native-svg', () => ({
  SvgXml: ({ xml, width, height, ...props }) => {
    const { View } = require('react-native')
    return (
      <View
        testID="svg-xml"
        {...props}
        style={{ width, height }}
        data-xml={xml}
      />
    )
  }
}))

jest.mock('@lingui/react/macro', () => ({
  useLingui: () => ({
    t: (template) => template
  })
}))

const { generateQRCodeSVG } = require('pear-apps-utils-qr')

const { logger } = require('../../utils/logger')

describe('WifiPasswordQRCode', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const defaultProps = {
    ssid: 'TestWiFi',
    password: 'testpassword123'
  }

  const renderComponent = (props = {}) =>
    render(
      <I18nProvider i18n={i18n}>
        <ThemeProvider>
          <WifiPasswordQRCode {...defaultProps} {...props} />
        </ThemeProvider>
      </I18nProvider>
    )

  describe('Rendering', () => {
    it('renders QR code when ssid and password are provided', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      const { getByTestId } = renderComponent()

      await waitFor(() => {
        expect(getByTestId('svg-xml')).toBeTruthy()
      })
    })

    it('displays correct title text', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      const { getByText } = renderComponent()

      await waitFor(() => {
        expect(
          getByText('Scan the QR-Code to connect to the Wi-Fi')
        ).toBeTruthy()
      })
    })

    it('renders QR code with correct dimensions', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      const { getByTestId } = renderComponent()

      await waitFor(() => {
        const svgElement = getByTestId('svg-xml')
        expect(svgElement.props.style.width).toBe(180)
        expect(svgElement.props.style.height).toBe(180)
      })
    })

    it('passes generated SVG to SvgXml component', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      const { getByTestId } = renderComponent()

      await waitFor(() => {
        const svgElement = getByTestId('svg-xml')
        expect(svgElement.props['data-xml']).toBe(mockSvgString)
      })
    })
  })

  describe('QR Code Generation', () => {
    it('generates QR code with correct WiFi string format', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      renderComponent()

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledWith(
          'WIFI:T:WPA;S:TestWiFi;P:testpassword123;H:false;;',
          { type: 'svg', margin: 0 }
        )
      })
    })

    it('generates QR code with custom encryption type', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      renderComponent({ encryptionType: 'WEP2' })

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledWith(
          'WIFI:T:WEP2;S:TestWiFi;P:testpassword123;H:false;;',
          { type: 'svg', margin: 0 }
        )
      })
    })

    it('generates QR code with hidden network flag', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      renderComponent({ isHidden: true })

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledWith(
          'WIFI:T:WPA;S:TestWiFi;P:testpassword123;H:true;;',
          { type: 'svg', margin: 0 }
        )
      })
    })

    it('uses special characters in SSID and password', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      renderComponent({
        ssid: 'WiFi Network & More',
        password: 'pass@word#123'
      })

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledWith(
          'WIFI:T:WPA;S:WiFi Network & More;P:pass@word#123;H:false;;',
          { type: 'svg', margin: 0 }
        )
      })
    })
  })

  describe('Edge Cases', () => {
    it('returns null when ssid is missing', () => {
      const { queryByTestId } = renderComponent({ ssid: '' })

      expect(queryByTestId('svg-xml')).toBeNull()
      expect(generateQRCodeSVG).not.toHaveBeenCalled()
    })

    it('returns null when password is missing', () => {
      const { queryByTestId } = renderComponent({ password: '' })

      expect(queryByTestId('svg-xml')).toBeNull()
      expect(generateQRCodeSVG).not.toHaveBeenCalled()
    })

    it('returns null when ssid is undefined', () => {
      const { queryByTestId } = renderComponent({ ssid: undefined })

      expect(queryByTestId('svg-xml')).toBeNull()
      expect(generateQRCodeSVG).not.toHaveBeenCalled()
    })

    it('returns null when password is undefined', () => {
      const { queryByTestId } = renderComponent({ password: undefined })

      expect(queryByTestId('svg-xml')).toBeNull()
      expect(generateQRCodeSVG).not.toHaveBeenCalled()
    })

    it('returns null when QR code SVG is not generated yet', () => {
      generateQRCodeSVG.mockImplementation(() => new Promise(() => {})) // Never resolves

      const { queryByTestId } = renderComponent()

      expect(queryByTestId('svg-xml')).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('logs error when QR code generation fails', async () => {
      const error = new Error('QR generation failed')
      generateQRCodeSVG.mockRejectedValue(error)

      renderComponent()

      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'Error generating QR code:',
          error
        )
      })
    })

    it('does not render QR code when generation fails', async () => {
      generateQRCodeSVG.mockRejectedValue(new Error('QR generation failed'))

      const { queryByTestId } = renderComponent()

      await waitFor(() => {
        expect(queryByTestId('svg-xml')).toBeNull()
      })
    })
  })

  describe('Props Handling', () => {
    it('uses default encryption type when not provided', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      renderComponent()

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledWith(
          'WIFI:T:WPA;S:TestWiFi;P:testpassword123;H:false;;',
          { type: 'svg', margin: 0 }
        )
      })
    })

    it('uses default hidden flag when not provided', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      renderComponent()

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledWith(
          'WIFI:T:WPA;S:TestWiFi;P:testpassword123;H:false;;',
          { type: 'svg', margin: 0 }
        )
      })
    })

    it('handles all props correctly together', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      renderComponent({
        ssid: 'CustomWiFi',
        password: 'custompass',
        encryptionType: 'WEP2',
        isHidden: true
      })

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledWith(
          'WIFI:T:WEP2;S:CustomWiFi;P:custompass;H:true;;',
          { type: 'svg', margin: 0 }
        )
      })
    })
  })

  describe('Re-rendering', () => {
    it('regenerates QR code when props change', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      const { rerender } = renderComponent()

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledTimes(1)
      })

      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <WifiPasswordQRCode
              ssid="NewWiFi"
              password="newpassword"
              encryptionType="WPA3"
              isHidden={true}
            />
          </ThemeProvider>
        </I18nProvider>
      )

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledTimes(2)
        expect(generateQRCodeSVG).toHaveBeenLastCalledWith(
          'WIFI:T:WPA3;S:NewWiFi;P:newpassword;H:true;;',
          { type: 'svg', margin: 0 }
        )
      })
    })

    it('does not regenerate QR code when props remain the same', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      const { rerender } = renderComponent()

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledTimes(1)
      })

      rerender(
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <WifiPasswordQRCode {...defaultProps} />
          </ThemeProvider>
        </I18nProvider>
      )

      await waitFor(() => {
        expect(generateQRCodeSVG).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Snapshot', () => {
    it('matches snapshot when QR code is rendered', async () => {
      const mockSvgString = '<svg>mock-qr-code</svg>'
      generateQRCodeSVG.mockResolvedValue(mockSvgString)

      const { toJSON } = renderComponent()

      await waitFor(() => {
        expect(toJSON()).toMatchSnapshot()
      })
    })
  })
})
