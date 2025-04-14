'use client'

import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import statusArray from '../../../../public/response.json'
import StatusWrapper from '@/components/serverPageWrappers/StatusWrapper'

export default function Status() {

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 ml-20'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Logs' />
				<StatusWrapper statusArray={statusArray} />
			</div>
		</div>
	)
}