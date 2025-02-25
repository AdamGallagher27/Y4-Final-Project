'use client'

import { AuthProvider } from '@/context/AuthContext'
import '../styles/globals.css'
import { MetaMaskProvider } from '@metamask/sdk-react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const host = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: 'Next-Metamask-Boilerplate',
      url: host,
    },
  }

  return (
    <html lang='en'>
      <AuthProvider>
        <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
          <body className='p-0 m-0'>
            {children}
          </body>
        </MetaMaskProvider>
      </AuthProvider>
    </html>
  )
}
