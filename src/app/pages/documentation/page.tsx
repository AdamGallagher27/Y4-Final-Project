'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'

export default function Documentation() {
	useAuthentication()

	return (
		<div className='flex'>
			<Sidebar />
		</div>
	)
}