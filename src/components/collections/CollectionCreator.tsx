'use client'

import { useState } from 'react'
import { Model, Property } from '@/types'
import { generateModelId, refreshPage } from '@/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const addNewModelToModels = async (model: Model) => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'

  try {
    const response = await fetch(`${apiUrl}api/models`, {
      method: 'POST',
      body: JSON.stringify(model)
    })

    if (!response.ok) {
      console.error(response.status)
    }
    console.log(await response.json())
  } catch (error) {
    console.error(error)
  }
}

const idTemplate = {
  'name': 'id',
  'type': 'string'
}

const CollectionCreator = () => {
  const [newCollectionName, setNewCollectionName] = useState('')
  const [properties, setProperties] = useState<Property[]>([{ name: '', type: 'string' }])
  const [open, setOpen] = useState(false)

  const handlePropertyChange = (index: number, key: keyof Property, value: string) => {
    const updatedProperties = [...properties]
    updatedProperties[index][key] = value
    setProperties(updatedProperties)
  }

  const addPropertyField = () => {
    setProperties([...properties, { name: '', type: 'string' }])
  }

  const removePropertyField = (index: number) => {
    const updatedProperties = properties.filter((_, i) => i !== index)
    setProperties(updatedProperties)
  }

  const handleCreateCollection = () => {
    if (newCollectionName) {
      const newCollection = {
        modelId: `${newCollectionName}-${generateModelId()}`,
        name: newCollectionName,
        properties: [idTemplate, ...properties.filter((p) => p.name)],
        items: [],
      }

      addNewModelToModels(newCollection)
      setNewCollectionName('')
      setProperties([{ name: '', type: 'string' }])
      setOpen(false)
      refreshPage()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* as child prevents hidration error */}
      <DialogTrigger asChild>
        <Button className='w-full'>Create Collection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Collection</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            type='text'
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder='Enter collection name'
          />
          <div className='space-y-2'>
            {properties.map((property, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <Input
                  type='text'
                  value={property.name}
                  onChange={(e) => handlePropertyChange(index, 'name', e.target.value)}
                  placeholder='Property name'
                />
                <Select
                  value={property.type}
                  onValueChange={(value: any) => handlePropertyChange(index, 'type', value)}
                >
                  <SelectTrigger className='w-[120px]'>
                    <SelectValue placeholder='Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='string'>String</SelectItem>
                    <SelectItem value='number'>Number</SelectItem>
                    <SelectItem value='boolean'>Boolean</SelectItem>
                  </SelectContent>
                </Select>
                {properties.length > 1 && (
                  <Button variant='destructive' onClick={() => removePropertyField(index)}>Remove</Button>
                )}
              </div>
            ))}
          </div>
          <div className='flex gap-3'>
            <Button onClick={addPropertyField}>Add Property</Button>
            <Button onClick={handleCreateCollection}>Save Collection</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CollectionCreator
