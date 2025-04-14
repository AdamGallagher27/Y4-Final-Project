'use client'

import { useState } from 'react'
import AddRow from './AddRow'
import CollectionTable from './CollectionTable'
import UpdateRow from './UpdateRow'
import DeleteRow from './DeleteRow'
import { Model, Item } from '@/types'
import Title from '../generic/Title'

interface Props {
	model: Model
}

export const CollectionPageWrapper = ({ model }: Props) => {
	const [selectedRow, setSelectedRow] = useState<Item | undefined>()
	const [refresh, setRefresh] = useState(false)

	return (
		<div className='w-full'>
			<div className='flex items-center justify-between'>
				<Title firstPartOfTitle='Collections' secondPartOfTitle={model.name} />
				<div className='flex items-center gap-2'>
					<AddRow selectedModel={model} setRefresh={setRefresh} />
					{selectedRow && (
						<>
							<UpdateRow selectedRow={selectedRow} setRefresh={setRefresh} model={model} />
							<DeleteRow selectedRowId={selectedRow.id} modelId={model.modelId} setRefresh={setRefresh} />
						</>
					)}
				</div>
			</div>
			<CollectionTable key={refresh.toString()} selectedModel={model} setSelectedRow={setSelectedRow} />
		</div>
	)
}
