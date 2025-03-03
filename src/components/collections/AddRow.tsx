'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Model } from '@/types'

interface Props {
  selectedModel: Model
}

// add validation
// save items to form as there actual type not just string
// add id and save to db
// presave booleans as false 

const AddRow = ({ selectedModel }: Props) => {
  const [form, setForm] = useState<{ [key: string]: string }>({})
  const [open, setOpen] = useState(false)

  const { properties } = selectedModel

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddRow = () => {
    console.log(form)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Row</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Row</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {properties.map((property, index) => {

            if (property.name === 'id') return

            if (property.type === 'boolean') {
              return (
                <div className='flex items-center justify-between h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm'>
                  <div className='text-[#71717A]'>Enter {property.name}</div>
                  <input
                    type='checkbox'
                    checked={form[property.name] === 'true'}
                    onChange={(e) => handleChange(property.name, e.target.checked ? 'true' : 'false')}
                  />
                </div>
              )
            }

            return (<div key={index} className='flex gap-2 items-center'>
              <Input
                type={property.type === 'number' ? 'number' : 'text'}
                value={form[property.name] || ''}
                onChange={(e) => handleChange(property.name, e.target.value)}
                placeholder={`Enter ${property.name}`}
              />
            </div>)
          })}
          <div className='flex gap-3'>
            <Button onClick={handleAddRow}>Save Row</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddRow
