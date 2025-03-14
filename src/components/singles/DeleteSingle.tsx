'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteSingle } from '@/utils/api'

interface Props {
  singleId: string 
  setRefresh: Dispatch<SetStateAction<boolean>>
}

const DeleteRow = ({ singleId, setRefresh }: Props) => {
  
  const [open, setOpen] = useState(false)

  const resetPopUp = () => {
    setRefresh(false)
    setOpen(false)
  }

  const handleDeleteSingle = async () => {
    const response = await deleteSingle(singleId)

    console.log(response)

    if(response) {
      resetPopUp()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-red-500 hover:bg-red-400'>Delete Single</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this Single?</DialogTitle>
        </DialogHeader>
        <div>          
          <Button className='bg-red-500 hover:bg-red-400' onClick={handleDeleteSingle}>Delete Row</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteRow
