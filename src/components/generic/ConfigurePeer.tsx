'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { addNewPeer } from '@/utils/api'

interface Props {
  setPeers: Dispatch<SetStateAction<string[]>>
}

const ConfigurePeer = ({ setPeers }: Props) => {
  const [url, setUrl] = useState<string | undefined>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
    }
  }, [open])

  const handleChange = (value: string) => {
    setUrl(value)
  }

  const resetPopUp = () => {
    setOpen(false)
  }

  const handleAddPeer = async () => {
    if (url) {
      const response = await addNewPeer(url)

      if (response) {
        setPeers((prevPeers) => [...prevPeers, url])
        resetPopUp()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='ml-3 mt-4'>Add New Peer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Peer</DialogTitle>
        </DialogHeader>
        <div>
          <div className='mb-3'>
            <Input
              type='text'
              value={url}
              onChange={(e) => handleChange(e.target.value)}
              placeholder='Enter peer URL'
            />
          </div>
          <div className='flex gap-3'>
            <Button onClick={handleAddPeer}>Add Peer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfigurePeer
