'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteRow } from '@/utils/api'

interface Props {
  selectedRowId: string 
  setRefresh: Dispatch<SetStateAction<boolean>>
  modelId: string
}

const DeleteRow = ({ modelId, selectedRowId, setRefresh }: Props) => {
  
  const [open, setOpen] = useState(false)

  const resetPopUp = () => {
    setRefresh(false)
    setOpen(false)
  }

  const handleDeleteRow = async () => {
    const response = await deleteRow(modelId, selectedRowId)

    if(response) {
      resetPopUp()
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
