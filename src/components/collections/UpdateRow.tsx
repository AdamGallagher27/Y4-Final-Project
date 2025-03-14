'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Item, Model } from '@/types'
import FormError from '../generic/FormError'
import { validateForm } from '@/utils'
import { Input } from '../ui/input'
import { updateCollectionRow } from '@/utils/api'

interface Props {
  selectedRow: Item
  setRefresh: Dispatch<SetStateAction<boolean>>
  model: Model
}

const UpdateRow = ({ selectedRow, setRefresh, model }: Props) => {
  const [form, setForm] = useState<{ [key: string]: string }>(selectedRow)
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setForm(selectedRow)

    if (!open) {
      setErrors({})
    }

  }, [open])

  const { properties } = model

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetPopUp = () => {
    setRefresh(false)
    setOpen(false)
  }

  const handleUpdateRow = async () => {
    if (validateForm(form, properties, setErrors)) {
      const response = await updateCollectionRow(model.modelId, form)
      response && resetPopUp()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-green-500 hover:bg-green-400'>Update Row</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Row</DialogTitle>
        </DialogHeader>
        <div>
          {Object.entries(selectedRow).map(([name, value], index) => {
            if (name === 'id') return null

            if (value === 'true' || value === 'false') {
              return (
                <div key={`${name}-${index}`} className='mb-3'>
                  <div className='flex items-center justify-between h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm'>
                    <div className='text-[#71717A]'>Enter {name}</div>
                    <input
                      type='checkbox'
                      // checked={value === 'true'}
                      onChange={(e) => handleChange(name, e.target.checked ? 'true' : 'false')}
                    />
                  </div>
                  <FormError message={errors[name]} />
                </div>
              );
            } else if (typeof value === 'number') {
              return (
                <div key={`${name}-${index}`} className='mb-3'>
                  <Input
                    type='number'
                    value={form[name] as string || ''}
                    onChange={(e) => handleChange(name, e.target.value)}
                    placeholder={`Enter ${name}`}
                  />
                  <FormError message={errors[name]} />
                </div>
              );
            } else if (typeof value === 'string') {
              return (
                <div key={`${name}-${index}`} className='mb-3'>
                  <Input
                    type='text'
                    value={form[name] as string || ''}
                    onChange={(e) => handleChange(name, e.target.value)}
                    placeholder={`Enter ${name}`}
                  />
                  <FormError message={errors[name]} />
                </div>
              );
            }
          })}
          <div className='flex gap-3'>
            <Button onClick={handleUpdateRow}>Update Row</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateRow
