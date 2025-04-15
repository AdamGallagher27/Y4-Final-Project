'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteRow } from '@/utils/api'
import { Item } from '@/types'

interface Props {
  selectedRowId: string 
  modelId: string
  setData: Dispatch<SetStateAction<Item[]>>
}

const DeleteRow = ({ setData, modelId, selectedRowId }: Props) => {
  
  const [open, setOpen] = useState(false)

  const handleDeleteRow = async () => {
    const response = await deleteRow(modelId, selectedRowId)

    if(response) {
      // update parent state variable without the deleted row
      // prevents rerender / api call
      setData(prevData => prevData.filter(row => row.id !== selectedRowId))
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-red-500 hover:bg-red-400'>Delete Row</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete the Row?</DialogTitle>
        </DialogHeader>
        <div>          
          <Button className='bg-red-500 hover:bg-red-400' onClick={handleDeleteRow}>Delete Row</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteRow
