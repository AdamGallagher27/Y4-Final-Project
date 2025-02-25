'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'

export default function Status() {
	useAuthentication()

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Logs' />
			</div>
		</div>
	)
}