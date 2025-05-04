'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Item } from '@/types'
import FormError from '../generic/FormError'
import { Input } from '../ui/input'
import { generatePropetiesArray, transformBoolStringsInForm, validateForm } from '@/utils'
import { updateSingle } from '@/utils/api'

interface Props {
  selectedSingle: Item
  setSelectedSingle: React.Dispatch<React.SetStateAction<Item | undefined>>
  setSingles: React.Dispatch<React.SetStateAction<Item[]>>
}

const UpdateSingle = ({ selectedSingle, setSelectedSingle, setSingles }: Props) => {

  const startingType = (() => {
    if (typeof selectedSingle.value === 'boolean') return 'boolean'
    if (typeof selectedSingle.value === 'number') return 'number'
    return 'string'
  })()

  const [form, setForm] = useState<{ [key: string]: string }>(selectedSingle)
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setForm(selectedSingle)

    if (!open) {
      setErrors({})
    }

  }, [open])

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetPopUp = () => {
    setOpen(false)
    setSelectedSingle(undefined)
  }

  const handleUpdateRow = async () => {
    if (validateForm(form, generatePropetiesArray(startingType), setErrors)) {
      const body = transformBoolStringsInForm(form)
      updateSingle(body)
      setSingles(prev => prev.map((single) => single.id === selectedSingle.id ? form : single))
      resetPopUp()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-green-500 hover:bg-green-400'>Update Single</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Single</DialogTitle>
        </DialogHeader>
        <div>
          {Object.entries(selectedSingle).map(([name, value], index) => {
            if (name === 'id') return null

            if (value === 'true' || value === 'false') {
              return (
                <div key={`${name}-${index}`} className='mb-3'>
                  <div className='flex items-center justify-between h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm'>
                    <div className='text-[#71717A]'>Enter {name}</div>
                    <input
                      // has to be form.value because form can be mutated but value const cannot be 
                      checked={form.value === 'true'}
                      type='checkbox'
                      onChange={(e) => handleChange(name, e.target.checked ? 'true' : 'false')}
                    />
                  </div>
                  <FormError message={errors[name]} />
                </div>
              )
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
              )
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
              )
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

export default UpdateSingle
