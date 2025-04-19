'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteSingle } from '@/utils/api'
import { Item } from '@/types'

interface Props {
  singleId: string 
  setSingles: React.Dispatch<React.SetStateAction<Item[]>>
  setSelectedSingle: React.Dispatch<React.SetStateAction<Item | undefined>>
}

const DeleteRow = ({ singleId, setSingles, setSelectedSingle }: Props) => {
  
  const [open, setOpen] = useState(false)

  const resetPopUp = () => {
    setOpen(false)
  }

  const handleDeleteSingle = async () => {
    const response = await deleteSingle(singleId)

    if(response) {
      setSingles(prevData => prevData.filter(single => single.id !== singleId))
      setSelectedSingle(undefined)
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
