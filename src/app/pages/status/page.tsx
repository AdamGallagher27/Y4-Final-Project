'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import ApiResponseTable from '@/components/generic/ApiResponseTable'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import { Button } from '@/components/ui/button'
import { StatusFromAPI } from '@/types'
import { getResponseStatus } from '@/utils/api'
import { useEffect, useState } from 'react'

export default function Status() {
	useAuthentication()

	const [responses, setResponses] = useState<StatusFromAPI[] | undefined>([])

	const handleApi = async () =>{
		setResponses(await getResponseStatus())
	}

	useEffect(() => {
		handleApi()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4 ml-20'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Logs' />
				<Button className='mt-3' onClick={handleApi}>Refresh Logs</Button>
				{responses && <ApiResponseTable responses={responses} />}
			</div>
		</div>
	)
}