'use client'
import { useState } from 'react'

interface Props {
  addToCollectionNames: (collectionName: string) => void
}

const addNewModelToModels = async (model: Model) => {

  try {
    const response = await fetch(`http://localhost:3000/api/models/${model.name}`, {
      method: 'POST',
      body: JSON.stringify(model)
    })

    if (!response.ok) {
      console.error(response.status)
    }
    console.log(await response.json())
  }
  catch (error) {
    console.error(error)
  }
}


const CollectionCreator = (props: Props) => {

  const { addToCollectionNames } = props

  // State to store collections and their items
  const [newCollectionName, setNewCollectionName] = useState('')
  const [properties, setProperties] = useState<Properties[]>([{ name: '', type: 'string' }])

  // Handle property name/type change
  const handlePropertyChange = (index: number, key: string, value: string) => {
    // also fix any later
    const updatedProperties: any[] = [...properties]
    updatedProperties[index][key] = value
    setProperties(updatedProperties)
  }

  // Add a new empty property input field
  const addPropertyField = () => {
    setProperties([...properties, { name: '', type: '' }])
  }

  // Remove a property input field
  const removePropertyField = (index: number) => {
    const updatedProperties = properties.filter((_, i) => i !== index)
    setProperties(updatedProperties)
  }

  // Create a new collection with properties
  const handleCreateCollection = () => {
    if (newCollectionName) {
      const newCollection = {
        name: newCollectionName,
        properties: properties.filter((p) => p.name),
        items: [],
      }

      addNewModelToModels(newCollection)
      addToCollectionNames(newCollection.name)
      setNewCollectionName('')
      setProperties([{ name: '', type: 'string' }])
    }
  }

  return (
    <div className='my-9'>
      <h2 className='font-bold'>Create a New Collection</h2>
      <div>
        <label className='italic'>Collection Name:</label>
        <input
          type='text'
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder='Enter collection name'
        />
      </div>
      <h3 className='italic'>Properties</h3>
      {properties.map((property, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            type='text'
            value={property.name}
            onChange={(e) =>
              handlePropertyChange(index, 'name', e.target.value)
            }
            placeholder='Property name'
          />
          <select
            value={property.type}
            onChange={(e) =>
              handlePropertyChange(index, 'type', e.target.value)
            }
          >
            <option value='string'>String</option>
            <option value='number'>Number</option>
            <option value='boolean'>Boolean</option>
          </select>
          {properties.length > 1 && (
            <button onClick={() => removePropertyField(index)}>Remove</button>
          )}
        </div>
      ))}
      <span className='flex gap-5'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={addPropertyField}>Add Property</button>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleCreateCollection}>Create Collection</button>
      </span>
    </div>
  )
}

export default CollectionCreator