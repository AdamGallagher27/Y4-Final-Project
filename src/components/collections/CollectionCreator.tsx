'use client'

import { useState } from 'react'
import { Model, Property } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateModelId } from '@/utils/security'
import FormError from '../generic/FormError'
import { saveModelToIndexedDB } from '@/utils/indexDB'
import { saveModelToGun } from '@/utils/api'

interface Props {
  setAllModels: React.Dispatch<React.SetStateAction<Model[]>>
}

const addNewModelToIndexDB = async (model: Model) => {
  try {
    await saveModelToIndexedDB(model)
  } catch (error) {
    console.error('Failed to save model:', error)
  }
}

const handleSaveModel = (model: Model) => {
  addNewModelToIndexDB(model)
  saveModelToGun(model)
}

const idTemplate = {
  'name': 'id',
  'type': 'string'
}


const CollectionCreator = ({ setAllModels }: Props) => {
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
    }

    if (validateNewCollection(newCollection)) {
      handleSaveModel(newCollection)
      setNewCollectionName('')
      setProperties([{ name: '', type: 'string' }])
      setOpen(false)
      setAllModels(allModels => [...allModels, newCollection])
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
