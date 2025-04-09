'use client'

import useAuthentication from '@/app/hooks/useAuthentication'
import AddRow from '@/components/collections/AddRow'
import CollectionTable from '@/components/collections/CollectionTable'
import DeleteRow from '@/components/collections/DeleteRow'
import UpdateRow from '@/components/collections/UpdateRow'
import InnerSideBar from '@/components/generic/InnerSideBar'
import Sidebar from '@/components/generic/Sidebar'
import RichTextInput from '@/components/generic/RichTextInput'
import Title from '@/components/generic/Title'
import { Item, Model } from '@/types'
import { getAllModels } from '@/utils/api'
import { useEffect, useState } from 'react'

export default function Database() {
	useAuthentication()
	const [allModels, setAllModels] = useState<Model[] | undefined>([])
	const [selectedModel, setSelectedModel] = useState<Model | undefined>()
	const [refresh, setRefresh] = useState<boolean>(false)
	const [selectedRow, setSelectedRow] = useState<Item | undefined>()

	useEffect(() => {
		const handleGetAllModels = async () => {
			const allModels = await getAllModels()
			setAllModels(allModels)
		}

		// im using refresh to force a rerender without reloading the whole page
		if (!refresh) setRefresh(true)

		handleGetAllModels()
	}, [refresh])

	return (
		<div className='flex'>
			<Sidebar />
			{allModels && <InnerSideBar allModels={allModels} selectedModel={selectedModel || allModels[0]} setSelectedModel={setSelectedModel} />}
			<div className='p-4 w-full'>
				{(selectedModel && selectedModel.name) &&
					<div className='flex items-center justify-between'>
						<Title firstPartOfTitle='Collections' secondPartOfTitle={selectedModel.name} />
						<div className='flex items-center gap-2'>
							<AddRow selectedModel={selectedModel} setRefresh={setRefresh} />
							{selectedRow &&
								<>
									<UpdateRow selectedRow={selectedRow} setRefresh={setRefresh} model={selectedModel} />
									<DeleteRow selectedRowId={selectedRow.id} modelId={selectedModel.modelId} setRefresh={setRefresh} />
								</>}
						</div>
					</div>
				}
				{(selectedModel && refresh) && <CollectionTable selectedModel={selectedModel} setSelectedRow={setSelectedRow} />}
				{/* <RichTextInput /> */}
			</div>
		</div>
	)
}