'use client'

import { useEffect, useState } from 'react'
import AddRow from './AddRow'
import CollectionTable from './CollectionTable'
import UpdateRow from './UpdateRow'
import DeleteRow from './DeleteRow'
import { Model, Item, Collection } from '@/types'
import Title from '../generic/Title'
import { getAllCollectionRows } from '@/utils/api'
import { transformBoolToStringValue } from '@/utils'

interface Props {
	model: Model
}

export const CollectionPageWrapper = ({ model }: Props) => {
	const [data, setData] = useState<Item[]>([])
	const [selectedRow, setSelectedRow] = useState<Item | undefined>()

	const { modelId, name } = model

	const reset = () => {
		// reset the selected row to prevent updating row in differente table
		setSelectedRow(undefined)
		setData([])
	}

	useEffect(() => {
		const handleGetAllRows = async () => {
			const response = await getAllCollectionRows(modelId)

			// boolean values need to be converted to strings for the ui to render there values
			const allData = response && transformBoolToStringValue(response) || []

			if (allData) {
				setData(allData)
			}
			else {
				setData([])
			}
		}

		model && handleGetAllRows()

		return () => reset()

	}, [model])

	return (
		<div className='w-full'>
			<div className='flex items-center justify-between'>
				<Title firstPartOfTitle='Collections' secondPartOfTitle={name} />
				<div className='flex items-center gap-2'>
					<AddRow setData={setData} selectedModel={model} />
					{selectedRow && (
						<>
							<UpdateRow setData={setData} selectedRow={selectedRow} model={model} />
							<DeleteRow setData={setData} selectedRowId={selectedRow.id} modelId={modelId} />
						</>
					)}
				</div>
			</div>
			<CollectionTable data={data} selectedModel={model} setSelectedRow={setSelectedRow} />
		</div>
	)
}
