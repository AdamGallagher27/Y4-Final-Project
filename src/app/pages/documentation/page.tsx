'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import { getAllModels } from '@/utils'
import { useEffect, useState } from 'react'

export default function Documentation() {
	useAuthentication()

	const [models, setModels] = useState([])

	useEffect(() => {
		const handleGetModels = async () => {
			setModels(await getAllModels())
		}
		handleGetModels()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			<div className='p-4'>
				<Title firstPartOfTitle='API' secondPartOfTitle='Documentation'></Title>
				{models && JSON.stringify(models)}
			</div>
		</div>
	)
}