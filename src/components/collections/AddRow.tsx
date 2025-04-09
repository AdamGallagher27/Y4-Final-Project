'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Model } from '@/types'
import FormError from '../generic/FormError'
import { transformBoolStringsInForm, validateForm } from '@/utils'
import { addRowToCollection } from '@/utils/api'
import RichTextInput from '../generic/RichTextInput'

interface Props {
  selectedModel: Model
  setRefresh: Dispatch<SetStateAction<boolean>>
}

// pre save form with properties that are boolean
const preProcessSelectedModel = (model: Model) => {
  const result: { [key: string]: string } = {}

  model.properties.forEach(property => {
    if (property.type === 'boolean') {
      result[property.name] = 'false'
    }
  })

  return result
}

const AddRow = ({ selectedModel, setRefresh }: Props) => {
  const [form, setForm] = useState<{ [key: string]: string }>(preProcessSelectedModel(selectedModel))
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if(!open) {
      setForm(preProcessSelectedModel(selectedModel))
      setErrors({})
    }
    
  }, [open])

  const { properties } = selectedModel

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetPopUp = () => {
    setRefresh(false)
    setOpen(false)
    setForm(preProcessSelectedModel(selectedModel))
  }

  const handleAddRow = async () => {
    if (validateForm(form, properties, setErrors)) {      
      const body = transformBoolStringsInForm(form)
      const response = await addRowToCollection(selectedModel.modelId, body)
      response && resetPopUp()
    }
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
        <div>
          
        <div className='mb-3'>
                  <div className='flex items-center justify-between h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm'>
                    <div className='text-[#71717A]'>Enter name</div>
                    <input
                      type='checkbox'
                      // checked={form[property.name] === 'true'}
                      // onChange={(e) => handleChange(property.name, e.target.checked ? 'true' : 'false')}
                    />
                  </div>
                  {/* <FormError message={errors[property.name]} /> */}
                </div>
          <RichTextInput />
          {properties.map((property, index) => {
            if (property.name === 'id') return

            if (property.type === 'boolean') {
              return (
                <div key={`${property}-${index}`} className='mb-3'>
                  <div className='flex items-center justify-between h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm'>
                    <div className='text-[#71717A]'>Enter {property.name}</div>
                    <input
                      type='checkbox'
                      checked={form[property.name] === 'true'}
                      onChange={(e) => handleChange(property.name, e.target.checked ? 'true' : 'false')}
                    />
                  </div>
                  <FormError message={errors[property.name]} />
                </div>
              )
            }
            else if (property.type === 'number') {
              return (<div key={`${property}-${index}`} className='mb-3' >
                <Input
                  type='number'
                  value={form[property.name] as string || ''}
                  onChange={(e) => handleChange(property.name, e.target.value)}
                  placeholder={`Enter ${property.name}`}
                />
                <FormError message={errors[property.name]} />
              </div>)
            }
            else if (property.type === 'string') {
              return (<div key={`${property}-${index}`} className='mb-3' >
                <Input
                  type='text'
                  value={form[property.name] as string || ''}
                  onChange={(e) => handleChange(property.name, e.target.value)}
                  placeholder={`Enter ${property.name}`}
                />
                <FormError message={errors[property.name]} />
              </div>)
            }
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
