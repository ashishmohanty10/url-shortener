import { UAParser } from 'ua-parser-js'
import { headers as nextHeaders } from 'next/headers'

export function extractClickMetadataFromHeaders(h?: Headers | ReturnType<typeof nextHeaders>) {
  const headers = (h as any) ?? nextHeaders()
  const ip =
    headers.get?.('x-forwarded-for') ||
    headers.get?.('cf-connecting-ip') ||
    headers.get?.('x-real-ip') ||
    ''
  const referer = headers.get?.('referer') || ''
  const userAgent = headers.get?.('user-agent') || ''
  const acceptLanguage = headers.get?.('accept-language') || ''
  const parser = new UAParser(userAgent)
  const device = parser.getDevice() || { vendor: '', model: '', type: '' }
  const os = parser.getOS() || { name: '', version: '' }
  const browser = parser.getBrowser() || { name: '', version: '' }

  return {
    ip,
    referer,
    userAgent,
    acceptLanguage,
    device: device.type
      ? `${device.vendor || ''} ${device.model || ''} ${device.type}`.trim()
      : 'Unknown',
    os: os.name ? `${os.name} ${os.version || ''}`.trim() : 'Unknown',
    browser: browser.name ? `${browser.name} ${browser.version || ''}`.trim() : 'Unknown',
    isBot: /bot|crawler|spider|crawling/i.test(userAgent),
    country: '',
    city: '',
  }
}
