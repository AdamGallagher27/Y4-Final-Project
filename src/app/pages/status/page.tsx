'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import ApiResponseTable from '@/components/generic/ApiResponseTable'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'

export default function Status() {
	useAuthentication()

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 w-full'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Logs' />
				<ApiResponseTable />
			</div>
		</div>
	)
}