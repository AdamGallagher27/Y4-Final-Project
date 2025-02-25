'use client'
import { ConnectWalletButton } from '@/components/metamask/ConnectWalletButton'
import { MetaMaskProvider } from '@metamask/sdk-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if(isLoggedIn) router.push('/database')

  }, [isLoggedIn, router])

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
    <div className='p-0 m-0'>
      <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
        <ConnectWalletButton setIsLoggedIn={setIsLoggedIn} />
      </MetaMaskProvider>
    </div>
  )
}
