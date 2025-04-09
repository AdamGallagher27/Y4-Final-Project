'use client'

import { useState } from 'react'
import { Model, Property } from '@/types'
import { refreshPage } from '@/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateModelId } from '@/utils/security'
import FormError from '../generic/FormError'

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

// push to the all modesl array to cause refresh

const CollectionCreator = () => {
  const [newCollectionName, setNewCollectionName] = useState('')
  const [properties, setProperties] = useState<Property[]>([{ name: '', type: 'string' }])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const handlePropertyChange = (index: number, key: keyof Property, value: string) => {
    const updatedProperties = [...properties]
    updatedProperties[index][key] = value
    setProperties(updatedProperties)
  }

  const addPropertyField = () => {
    setProperties([...properties, { name: '', type: 'string' }])
  }

  const validateNewCollection = (newCollection: Model) => {
    const { properties, name } = newCollection

    // if the properties length is one it means there is only the id and the collection is invalid
    if (properties.length === 1 || !name) {
      setError('Collection name and Properties are required')
      return false
    }
  
    setError(undefined)
    return true
  }

  const removePropertyField = (index: number) => {
    const updatedProperties = properties.filter((_, i) => i !== index)
    setProperties(updatedProperties)
  }

  const handleCreateCollection = () => {
    const newCollection = {
      modelId: `${newCollectionName}-${generateModelId()}`,
      name: newCollectionName,
      properties: [idTemplate, ...properties.filter((p) => p.name)],
      items: [],
    }

    if (validateNewCollection(newCollection)) {
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
        {error && <FormError message={error} />}
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
                    <SelectItem value='richtext'>RichText</SelectItem>
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
