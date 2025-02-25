'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'

export default function Database() {
	useAuthentication()

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4'>
				<Title firstPartOfTitle='Collections' secondPartOfTitle='SelectedCollectionName' />
			</div>
		</div>
	)
}