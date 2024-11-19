'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
  addToCollectionNames: (collectionName: string) => void
}

const CollectionCreator = (props: Props) => {

  const { addToCollectionNames } = props

  // State to store collections and their items
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollectionName, setNewCollectionName] = useState('')
  const [properties, setProperties] = useState([{ name: '', type: 'string' }])
  // const [activeCollection, setActiveCollection] = useState(null)
  // const [newItem, setNewItem] = useState({})

  // Handle property name/type change
  const handlePropertyChange = (index: number, key: string, value: string) => {
    // also fix any later
    const updatedProperties: any[] = [...properties]
    updatedProperties[index][key] = value
    setProperties(updatedProperties)
  }

  // Add a new empty property input field
  const addPropertyField = () => {
    setProperties([...properties, { name: '', type: 'string' }])
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
      setCollections([...collections, newCollection])
      addToCollectionNames(newCollection.name)
      setNewCollectionName('')
      setProperties([{ name: '', type: 'string' }]) // Reset form
    }
  }

  return (
    <div>
      <h2>CollectionCreator</h2>
      <div>
        <label>Collection Name:</label>
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="Enter collection name"
        />
      </div>
      <h3>Properties</h3>
      {properties.map((property, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={property.name}
            onChange={(e) =>
              handlePropertyChange(index, 'name', e.target.value)
            }
            placeholder="Property name"
          />
          <select
            value={property.type}
            onChange={(e) =>
              handlePropertyChange(index, 'type', e.target.value)
            }
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>
          {properties.length > 1 && (
            <button onClick={() => removePropertyField(index)}>Remove</button>
          )}
        </div>
      ))}
      <button onClick={addPropertyField}>Add Property</button>
      <div>
        <button onClick={handleCreateCollection}>Create Collection</button>
      </div>

      {/* [{"name":"car","properties":[{"name":"wheels","type":"number"}],"items":[]},{"name":"houses","properties":[{"name":"doors","type":"number"}],"items":[]}]*/}
      <p>collection = array of objects with a name which is a string and properties which is an array of objects that have a name and a type</p>
      {JSON.stringify(collections)}
    </div>
  )
}

export default CollectionCreator