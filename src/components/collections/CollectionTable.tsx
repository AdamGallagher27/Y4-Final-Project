'use client'

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Input } from '../ui/input'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Item, Model, Property } from '@/types'
import Loading from '../generic/Loading'

const generateColumns = (properties: Property[]): ColumnDef<any>[] => {
	return properties.map((property) => {
		return {
			accessorKey: property.name,
			header: property.name,
		}
	})
}

interface CollectionTableProps {
	data: Item[] | undefined
	selectedModel: Model
	setSelectedRow: Dispatch<SetStateAction<Item | undefined>>
	selectedRow: Item | undefined
}

const CollectionTable = ({ data, selectedModel, selectedRow, setSelectedRow }: CollectionTableProps) => {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [isLoading, setIsLoading] = useState(true)

	const columns = generateColumns(selectedModel.properties)
	const table = useReactTable({
		data: data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
		},
	})


	useEffect(() => {
		// WHen i use type timeout it throws ts error this is a quick fix that solves it
		let timeoutId: ReturnType<typeof setTimeout>
		
		setIsLoading(true)
		timeoutId = setTimeout(() => {
			setIsLoading(false)
		}, 3000)

		return () => clearTimeout(timeoutId);
	}, [selectedModel])

	if (isLoading) {
		return <Loading />
	}

	if (data && data.length === 0) {
		return <p className='m-2'>No entries yet</p>
	}

	return (
		<div className='w-fit'>
			<div className='mb-4'>
				{(data && data?.length > 0) && <Input
					placeholder='Filter by id'
					value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('id')?.setFilterValue(event.target.value)
					}
					className='max-w-sm mt-8'
				/>}
			</div>
			<div className='rounded-md'>
				<Table className='border-none'>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className='border-none text-[#94A3B8]'>
										{flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} className='border-none'>
								{row.getVisibleCells().map((cell) => {
									const isIdColumn = cell.column.id === 'id'

									return (
										<TableCell key={cell.id} className='border-none'>
											{isIdColumn ? (
												<div className='flex items-center'>
													<input
														type='radio'
														id={`radio-${row.id}`}
														name='row-select'
														checked={selectedRow?.id === row.original.id}
														onChange={() => {
															if (!selectedRow || selectedRow.id !== row.original.id) {
																setSelectedRow(row.original);
																row.toggleSelected(true);
															} else {
																setSelectedRow(undefined);
																row.toggleSelected(false);
															}
														}}
													/>
													<label htmlFor={`radio-${row.id}`} className='ml-2 '>
														{cell.renderValue() as string}
													</label>
												</div>
											) : (
												<div className='max-w-48 truncate'>
													{cell.renderValue() as string}
												</div>
											)}
										</TableCell>
									)
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default CollectionTable
