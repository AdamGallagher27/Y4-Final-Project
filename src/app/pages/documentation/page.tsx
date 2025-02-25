'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'

export default function Documentation() {
	useAuthentication()

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Documentation'></Title>
			</div>
		</div>
	)
}