'use client'

import useAllModels from '@/app/hooks/useAllModels'
import { CollectionPageWrapper } from '@/components/collections/CollectionPageWrapper'
import InnerSideBar from '@/components/generic/InnerSideBar'
import Sidebar from '@/components/generic/Sidebar'
import { Model } from '@/types'
import { useEffect, useState } from 'react'

export default function Database() {
	const {models, loading} = useAllModels()
	const [selectedModel, setSelectedModel] = useState<Model | undefined>()

	useEffect(() => {
		if (!selectedModel && models && models.length > 0) {
			setSelectedModel(models[0])
		}
	}, [models, selectedModel])

	if (loading || !models) {
		return <div className='p-4'>Loading</div>
	}

	return (
		<div className='flex'>
			<Sidebar />
			<InnerSideBar
				allModels={models}
				selectedModel={selectedModel || models[0]}
				setSelectedModel={setSelectedModel}
			/>
			<div className='p-4 w-full'>
				{selectedModel && <CollectionPageWrapper model={selectedModel} />}
			</div>
		</div>
	)
}