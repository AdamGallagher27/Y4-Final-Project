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
import { useEffect, useState } from 'react'
import { Collection, Model, Property } from '@/types'
import { getAllCollectionRows } from '@/utils'

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
}

const CollectionTable = ({ selectedModel }: CollectionTableProps) => {

	const [data, setData] = useState<Collection[] | undefined>([])

	useEffect(() => {
		const handleGetAllRows = async () => {
			const allData = await getAllCollectionRows(selectedModel.modelId)
			
			if(allData) {
				setData(allData)
			}

		}
		handleGetAllRows()
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
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className='border-none'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default CollectionTable
