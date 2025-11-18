import { UAParser } from 'ua-parser-js'

export async function extractClickMetadataFromHeaders(h: Headers) {
  const ip =
    h.get?.('x-forwarded-for')?.split(',')[0].trim() ||
    h.get?.('cf-connecting-ip') ||
    h.get?.('x-real-ip') ||
    ''

  const referer = h.get?.('referer') || ''
  const userAgent = h.get?.('user-agent') || ''
  const acceptLanguage = h.get?.('accept-language') || ''

  const parser = new UAParser(userAgent)
  const device = parser.getDevice()
  const os = parser.getOS()
  const browser = parser.getBrowser()

  const deviceType =
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
