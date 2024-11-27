'use client'

import { useState, useEffect } from 'react'
import './globals.css'
import { Providers } from '../providers/Providers'
import { Toaster } from 'react-hot-toast'
import { Righteous } from 'next/font/google'
import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en">
      <body className="bg-[#001F3F]">
        <Providers>
          <header>
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-2">
              <div className="flex-shrink-0">
                <Image
                  src="https://www.upload.ee/image/17400934/BBLogoV1.png"
                  alt="Based Bulletin Logo"
                  width={240}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex items-center space-x-4">
                <ConnectButton />
              </div>
            </div>
          </header>
          <main className="pt-24 pb-12 min-h-screen">
            <div className="max-w-3xl mx-auto px-6">
              {mounted ? children : null}
            </div>
          </main>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}