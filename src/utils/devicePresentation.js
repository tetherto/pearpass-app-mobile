import {
  Devices,
  LaptopMac,
  LaptopWindows,
  PhoneIphone,
  Tablet
} from '@tetherto/pearpass-lib-ui-kit/icons'

/**
 * @param {string | number | Date} dateInput
 * @param {string} [locale]
 * @returns {string}
 */
export const formatDeviceDate = (dateInput, locale) => {
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const day = date.getDate()
  const month = date.toLocaleString(locale, { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

/**
 * @param {string | undefined} deviceName
 */
export const getDeviceIcon = (deviceName) => {
  if (!deviceName) return Devices
  const lowerName = deviceName.toLowerCase()
  if (lowerName.startsWith('ios') || lowerName.includes('iphone'))
    return PhoneIphone
  if (lowerName.startsWith('android')) return PhoneIphone
  if (lowerName.includes('ipad') || lowerName.includes('tablet')) return Tablet
  if (
    lowerName.includes('mac') ||
    lowerName.includes('imac') ||
    lowerName.includes('macbook')
  )
    return LaptopMac
  if (lowerName.includes('windows')) return LaptopWindows
  return Devices
}
