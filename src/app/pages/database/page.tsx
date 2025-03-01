'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import CollectionTable from '@/components/collections/CollectionTable'
import InnerSideBar from '@/components/generic/InnerSideBar'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import { Model } from '@/types'
import { getAllModels } from '@/utils'
import { useEffect, useState } from 'react'

export default function Database() {
	useAuthentication()
	const [allModels, setAllModels] = useState<Model[] | undefined>([])
	const [selectedModel, setSelectedModel] = useState<Model | undefined>()

	useEffect(() => {
		const handleGetAllModels = async () => {
			const allModels = await getAllModels()
			setAllModels(allModels)

			if (allModels && allModels.length > 0) {
				setSelectedModel(allModels[0])
			}
		}

		handleGetAllModels()
	}, [])

	return (
		<div className='flex'>
			<Sidebar />
			{selectedModel && <InnerSideBar allModels={allModels} selectedModel={selectedModel} setSelectedModel={setSelectedModel} />}
			<div className='p-4 w-full'>
				{(selectedModel && selectedModel.name) && <Title firstPartOfTitle='Collections' secondPartOfTitle={selectedModel.name} />}
				{selectedModel && <CollectionTable selectedModel={selectedModel} />}
			</div>
		</div>
	)
}