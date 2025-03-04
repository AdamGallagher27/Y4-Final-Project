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
import { Collection, Item, Model, Property } from '@/types'
import { getAllCollectionRows } from '@/utils'
import Loading from '../generic/Loading'

const generateColumns = (properties: Property[]): ColumnDef<any>[] => {
	return properties.map((property) => {
		return {
			accessorKey: property.name,
			header: property.name,
			cell: ({ row }) => {
				const value: string | number | boolean = row.getValue(property.name)

				if (property.type === 'boolean') {
					return <div>{value ? 'true' : 'false'}</div>
				}

				return <div>{value}</div>
			},
		}
	})
}

interface CollectionTableProps {
	selectedModel: Model
	setSelectedRow: Dispatch<SetStateAction<Item | undefined>>
}

const CollectionTable = ({ selectedModel, setSelectedRow }: CollectionTableProps) => {

	const [loading, setLoading] = useState<boolean>(true)
	const [data, setData] = useState<Collection[] | undefined>([])

	useEffect(() => {
		// reset the selected row to prevent updating row in differente table
		setSelectedRow(undefined)

		const timer = setTimeout(() => {
			setLoading(false)
		}, 3000)

		const handleGetAllRows = async () => {
			const allData = await getAllCollectionRows(selectedModel.modelId)

			if (allData) {
				setData(allData)
			}
			else {
				setData([])
			}
		}

		handleGetAllRows()

		// cleanup timeout and reset loading
		return () => {
			clearTimeout(timer)
			setLoading(true)
		}
	}, [selectedModel])

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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

	if (loading) {
		return <Loading />
	}

	if (!loading && data && data.length === 0) {
		return <p>No entries yet</p>
	}

	return (
		<div className='w-full'>
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
														// value={cell.renderValue() as string}
														onChange={() => {
															setSelectedRow(row.original)
															row.toggleSelected(true)
														}}
													/>
													<label htmlFor={`radio-${row.id}`} className='ml-2'>
														{cell.renderValue() as string}
													</label>
												</div>
											) : (
												cell.renderValue() as string
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
