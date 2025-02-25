'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useSDK } from '@metamask/sdk-react'
import { useRouter } from 'next/navigation'

export default function Profile() {
	const { setIsLoggedIn, setWalletAddress } = useAuth()
  const { sdk } = useSDK()
	const router = useRouter()

  const disconnect = () => {
    if (sdk) {
      sdk.terminate()
      setIsLoggedIn(false)
      setWalletAddress('') 
		}
  }

	const logoutAndRedirect = () => {
		disconnect()
		router.push('/')
	}

	useAuthentication()

	return (
		<div className='flex'>
			<Sidebar />
			<Button className='m-8' onClick={logoutAndRedirect}>Logout</Button>
		</div>
	)
}