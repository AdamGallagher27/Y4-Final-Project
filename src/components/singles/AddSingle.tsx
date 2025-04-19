'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import FormError from '../generic/FormError'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { generatePropetiesArray, transformBoolStringsInForm, validateForm } from '@/utils'
import { addNewSingle } from '@/utils/api'
import { Item } from '@/types'

interface Props {
  setSingles: React.Dispatch<React.SetStateAction<Item[]>>
}


const AddRow = ({setSingles}: Props) => {
  const [form, setForm] = useState<{ [key: string]: string }>({ id: '', value: '' })
  const [selectedType, setSelectedType] = useState<'string' | 'number' | 'boolean'>('string')
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (!open) {
      setErrors({})
    }
  }, [open])

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (type: 'string' | 'number' | 'boolean') => {
    setSelectedType(type)
    setForm((prev) => ({ ...prev, value: '' })) // Reset value when changing type
  }

  const resetPopUp = () => {
    setOpen(false)
  }

  const handleAddRow = async () => {
    if (validateForm(form, generatePropetiesArray(selectedType), setErrors)) {
      const body = transformBoolStringsInForm(form)
      addNewSingle(body)
      setSingles(prevSingles => [...prevSingles, form])
      resetPopUp()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Single</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Single</DialogTitle>
        </DialogHeader>
        <div>
          <div className='mb-3'>
            <FormError message={errors['id']} />
            <Input
              type='text'
              onChange={(e) => handleChange('id', e.target.value)}
              placeholder={`Enter Id`}
            />

            <div className='flex gap-2 mt-2'>
              <Input
                type={selectedType === 'number' ? 'number' : 'text'}
                value={form.value}
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder='Single Value'
              />

              <Select defaultValue='string' onValueChange={(value) => handleTypeChange(value as 'string' | 'number' | 'boolean')}>
                <SelectTrigger className='w-[120px]'>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='string'>String</SelectItem>
                  <SelectItem value='number'>Number</SelectItem>
                  <SelectItem value='boolean'>Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormError message={errors['value']} />
          </div>
          <div className='flex gap-3'>
            <Button onClick={handleAddRow}>Save Row</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddRow
