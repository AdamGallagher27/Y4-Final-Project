import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Model } from '@/types'
import CollectionCreator from '../collections/CollectionCreator'

interface Props {
	allModels?: Model[]
	selectedModel?: Model
	setSelectedModel: Dispatch<SetStateAction<Model | undefined>>
}

const InnerSideBar = ({ allModels, selectedModel, setSelectedModel }: Props) => {

	return (
		<div className='h-screen w-56 flex flex-col items-center border-r border-[#E2E8F0] px-3 py-5 space-y-5'>
			<CollectionCreator />
			<ul>
				{allModels && allModels.map(model => {
					if (selectedModel && allModels) {
						return <li key={model.modelId} onClick={() => setSelectedModel(model)} className={`hover:cursor-pointer w-40 p-1.5 border-b border-[#E2E8F0] ${model.name === selectedModel.name ? 'text-black' : 'text-[#94A3B8]'}`}>{model.name}</li>
					}
				})}
			</ul>
		</div>
	)
}

export default InnerSideBar