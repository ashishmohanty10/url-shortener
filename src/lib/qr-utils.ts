import QRCode from 'qrcode'

export async function generateQRCodeDataURL(text: string, width = 200): Promise<string> {
  if (!text) throw new Error('Cannot generate QR code: text is empty.')

  try {
    return await QRCode.toDataURL(text, {
      width,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
  } catch (error) {
    console.error('QR code generation failed:', error)
    throw error
  }
}
