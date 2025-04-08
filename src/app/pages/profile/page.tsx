'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import ConfigurePeer from '@/components/generic/ConfigurePeer'
import PeersTable from '@/components/generic/PeersTable'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { getAllPeers } from '@/utils/api'
import { useSDK } from '@metamask/sdk-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

	const [peers, setPeers] = useState<string[]>([])

	useEffect(() => {
		const handleGetAllPeers = async () => {
			setPeers(await getAllPeers())
		}

		handleGetAllPeers()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 ml-20'>
				<Title firstPartOfTitle='Profile' secondPartOfTitle='User' />
				<Button className='mt-4 ml-2 mb-4' onClick={logoutAndRedirect}>Logout</Button>

				<Title firstPartOfTitle='Profile' secondPartOfTitle='Peers' />
				{peers && <PeersTable peers={peers} />}
				<ConfigurePeer setPeers={setPeers} />
			</div>
		</div>
	)
}