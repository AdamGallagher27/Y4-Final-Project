'use client'

import Sidebar from '@/components/generic/Sidebar'
import configuredPeers from '../../../../public/peers.json'
import ProfileWrapper from '@/components/serverPageWrappers/ProfileWrapper'

export default function Profile() {
	return (
		<div className='flex'>
			<Sidebar />
			<ProfileWrapper configuredPeers={configuredPeers} />
		</div>
	)
}