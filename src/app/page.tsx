'use client'
import { ConnectWalletButton } from '@/components/metamask/ConnectWalletButton'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/pages/database')

  }, [isAuthenticated, router])


  return (
    <div className='p-0 m-0'>
      <ConnectWalletButton setIsAuthenticated={setIsAuthenticated} />
    </div>
  )
}
