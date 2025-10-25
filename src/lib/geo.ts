import { UAParser } from 'ua-parser-js'

export function extractClickMetadata(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip')
  const referer = req.headers.get('referer') || ''
  const userAgent = req.headers.get('user-agent') || ''
  const acceptLanguage = req.headers.get('accept-language') || ''
  const parser = new UAParser(userAgent)

  return {
    ip,
    referer,
    userAgent: parser.getResult(),
    acceptLanguage,
    device: parser.getDevice() || 'Unknown',
    os: parser.getOS() || 'Unknown',
    browser: parser.getBrowser() || 'Unknown',
    isBot: /bot|crawler|spider|crawling/i.test(userAgent),
    country: '',
    city: '',
  }
}
