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
import { User } from '@/types'
import { Input } from '../ui/input'
import { useState } from 'react'
import NotFound from './NotFound'


const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => (
      <div>{row.getValue('email')}</div>
    ),
  }
]

interface Props {
  users: User[]
}

const UserResponseTable = ({ users }: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data: users,
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
          placeholder='Filter'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className='max-w-sm mt-8'
        />
      </div>

      {users.length === 0 ? <NotFound item='Users' /> : <div className='rounded-md'>
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
      </div>}
    </div>
  )
}

export default UserResponseTable
