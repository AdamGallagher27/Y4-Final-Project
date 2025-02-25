'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'

export default function Status() {
	useAuthentication()

	return (
		<div className='flex'>
			<Sidebar />
		</div>
	)
}