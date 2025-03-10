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
import { Item } from '@/types'
import { Input } from '../ui/input'
import { Dispatch, SetStateAction, useState } from 'react'
import NotFound from '../generic/NotFound'


const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div>{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'value',
    header: 'VALUE',
    cell: ({ row }) => (
      <div>{row.getValue('value')}</div>
    ),
  }
]

interface Props {
  singles: Item[]
  setSelectedRow: Dispatch<SetStateAction<Item | undefined>>
}

const SinglesResponseTable = ({ singles, setSelectedRow }: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data: singles,
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
    <div className='w-96'>
      <div className='mb-4 '>
        <Input
          placeholder='Filter'
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className='max-w-sm mt-8'
        />
      </div>

      {singles.length === 0 ? <NotFound item='Singles' /> : <div className='rounded-md'>
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
                            onChange={() => {
                              setSelectedRow(row.original)
                              row.toggleSelected(true)
                            }}
                          />
                          <label htmlFor={`radio-${row.id}`} className='ml-2'>
                            {cell.renderValue() as string}
                          </label>
                        </div>
                      ) : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>}
    </div>
  )
}

export default SinglesResponseTable
