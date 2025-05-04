'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Item, Model } from '@/types'
import { transformBoolStringsInForm, validateForm } from '@/utils'
import { Input } from '../ui/input'
import { updateCollectionRow } from '@/utils/api'
import { ScrollArea } from '../ui/scroll-area'
import RichTextInput from '../generic/RichTextInput'
import FormError from '../generic/FormError'

interface Props {
  setData: Dispatch<SetStateAction<Item[]>>
  selectedRow: Item
  setSelectedRow: Dispatch<SetStateAction<Item | undefined>>
  model: Model
}

const UpdateRow = ({ setData, selectedRow, setSelectedRow, model }: Props) => {
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
    setOpen(false)
    setSelectedRow(undefined)
  }

  const handleUpdateRow = async () => {
    if (validateForm(form, properties, setErrors)) {
      const body = transformBoolStringsInForm(form)
      const response = await updateCollectionRow(model.modelId, body)

      // after validation and updating db
      // update the rows array i.e (data) with valid form variable
      if (response) {
        setData(prevData => prevData.map((row: Item) => row.id === form.id ? form : row))
        resetPopUp()
      }
    }
  }

  const isPropertyRichText = (name: string) => {
    return model.properties.some(property => property.name === name && property.type === 'richtext')
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
        <ScrollArea className='max-h-[600px]'>
          {Object.entries(selectedRow).map(([name, value], index) => {
            if (name === 'id') return null

            if (isPropertyRichText(name)) {
              return (<div key={`${name}-${index}`} className='mb-3'>
                <RichTextInput name={name} handleChange={handleChange} content={value} />
                <FormError message={errors[name]} />
              </div>)
            }
            else if (value === 'true' || value === 'false') {
              return (
                <div key={`${name}-${index}`} className='mb-3'>
                  <div className='flex items-center justify-between h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm'>
                    <div className='text-[#71717A]'>Enter {name}</div>
                    <input
                      type='checkbox'
                      checked={form[name] === 'true'}
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
            }
            else if (typeof value === 'string') {
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
        </ScrollArea >
      </DialogContent>
    </Dialog>
  )
}

export default UpdateRow
