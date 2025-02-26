'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import ApiResponseTable from '@/components/generic/ApiResponseTable'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import { StatusFromAPI } from '@/types'
import { getResponseStatus } from '@/utils'
import { useEffect, useState } from 'react'

export default function Status() {
	useAuthentication()

	const [responses, setResponses] = useState<StatusFromAPI[] | undefined>([])

	useEffect(() => {
		const handleApi = async () =>{
			setResponses(await getResponseStatus())
		}

		handleApi()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			{/* im using w95% instead of w-full to prevent a sidebar bug */}
			<div className='p-4 w-[95%]'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Logs' />
				{responses && <ApiResponseTable responses={responses} />}
			</div>
		</div>
	)
}