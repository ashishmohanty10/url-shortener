import { UAParser } from 'ua-parser-js'
import { headers as nextHeaders } from 'next/headers'

export function extractClickMetadataFromHeaders(h?: Headers | ReturnType<typeof nextHeaders>) {
  const headers = (h as any) ?? nextHeaders()

  const ip =
    headers.get?.('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get?.('cf-connecting-ip') ||
    headers.get?.('x-real-ip') ||
    ''

  const referer = headers.get?.('referer') || ''
  const userAgent = headers.get?.('user-agent') || ''
  const acceptLanguage = headers.get?.('accept-language') || ''

  const parser = new UAParser(userAgent)
  const device = parser.getDevice()
  const os = parser.getOS()
  const browser = parser.getBrowser()

  let deviceType =
    device.type ||
    (/mobile|iphone|android|opera mini/i.test(userAgent)
      ? 'mobile'
      : /tablet|ipad|playbook|silk/i.test(userAgent)
        ? 'tablet'
        : /smart-tv|appletv|googletv/i.test(userAgent)
          ? 'smarttv'
          : /bot|crawler|spider/i.test(userAgent)
            ? 'bot'
            : /playstation|xbox|nintendo/i.test(userAgent)
              ? 'console'
              : 'desktop')

  return {
    ip,
    referer,
    userAgent,
    acceptLanguage,
    device: { type: deviceType },
    os: { name: os.name || 'Unknown' },
    browser: { name: browser.name || 'Unknown' },
    isBot: deviceType === 'bot',
    // country and city will be populated by the queue processor
  }
}
