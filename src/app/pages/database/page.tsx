'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import AddRow from '@/components/collections/AddRow'
import CollectionTable from '@/components/collections/CollectionTable'
import InnerSideBar from '@/components/generic/InnerSideBar'
import Sidebar from '@/components/generic/Sidebar'
import Title from '@/components/generic/Title'
import { Button } from '@/components/ui/button'
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
				{(selectedModel && selectedModel.name) &&
					<div className='flex items-center justify-between'>
						<Title firstPartOfTitle='Collections' secondPartOfTitle={selectedModel.name} /> <AddRow selectedModel={selectedModel} />
					</div>
					}
				{selectedModel && <CollectionTable selectedModel={selectedModel} />}
			</div>
		</div>
	)
}