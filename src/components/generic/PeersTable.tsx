import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'

type Props = {
  peers: string[]
}

const PeersTable = ({ peers }: Props) => {

  const peersWithDefaultPeer = [process.env.NEXT_PUBLIC_GUN_URL,...peers]

  return (
    <div className='overflow-x-auto mt-5 ml-3'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Peer</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {peersWithDefaultPeer.map((peer, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell> 
              <TableCell>{peer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PeersTable
