'use client'

import { useEffect, useState } from 'react'
import { QrCode, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { generateQRCodeDataURL } from '@/lib/qr-utils'
import { Separator } from '../ui/separator'

interface QRcodeModalProps {
  url: string
}

export function QRcodeModal({ url }: QRcodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    if (!url) return
    generateQRCodeDataURL(url)
      .then(setQrCodeUrl)
      .catch(err => console.error('QR generation failed:', err))
  }, [url])

  const handleDownload = () => {
    if (!qrCodeUrl) return
    const a = document.createElement('a')
    a.href = qrCodeUrl
    a.download = 'shorten/qrCode.png'
    a.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent text-sm rounded-sm">
          <QrCode className="h-4 w-4" />
          QR Code
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-start gap-x-5">
            <span>QR Code</span>
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <div className="flex flex-col items-center justify-center pt-6">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          ) : (
            <p className="text-sm text-muted-foreground">Generating QR code...</p>
          )}
          <p className="text-center text-xs text-muted-foreground mt-3 break-all">{url}</p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-5 w-full"
            onClick={handleDownload}
            disabled={!qrCodeUrl}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
