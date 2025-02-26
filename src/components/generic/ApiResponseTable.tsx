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
import { Checkbox } from '@/components/ui/checkbox'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { StatusFromAPI } from '@/types'
import { Input } from '../ui/input'
import { useState } from 'react'


const columns: ColumnDef<StatusFromAPI>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
	},
	{
		accessorKey: 'status',
		header: () => <div className='w-[-1000px]'>STATUS</div>,
		cell: ({ row }) => {
			const status = row.getValue('status') as string
			const colour = `${status.toString()[0] === '2' ? 'text-green-500' : 'text-red-500'} font-medium`

			return <div className={colour} >{status}</div>
		},
	},
	{
		accessorKey: 'url',
		header: 'URL',
		cell: ({ row }) => (
			<div>{row.getValue('url')}</div>
		),
	},
	{
		accessorKey: 'createdAt',
		header: () => <div className='text-right mr-10'>CREATED_AT</div>,
		cell: ({ row }) => (
			<div className='text-right'>{row.getValue('createdAt')}</div>
		),
	},
]

interface Props {
	responses: StatusFromAPI[]
}

const ApiResponseTable = ({ responses }: Props) => {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const table = useReactTable({
		data: responses,
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
				<Input
					placeholder='Filter by endpoint'
					value={(table.getColumn('url')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('url')?.setFilterValue(event.target.value)
					}
					className='max-w-sm mt-8'
				/>
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

export default ApiResponseTable
