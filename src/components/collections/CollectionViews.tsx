import { Collection } from '@/types'
import { getModel } from '@/utils'
import React, { useEffect, useState } from 'react'

type Props = {
  selectedCollectionName: string
}

const addNewRowToDB = async (body: Collection, selectedCollectionName: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/collections/${selectedCollectionName}`, {
      method: 'POST',
      body: JSON.stringify(body)
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

const CollectionViews = (props: Props) => {

  const { selectedCollectionName } = props
  const [collection, setCollection] = useState<Collection | undefined>()

  // fix any later
  const [newItem, setNewItem] = useState<any>()

  useEffect(() => {
    // I need async/await to load the model from public folder
    const loadCollection = async () => { setCollection(await getModel(selectedCollectionName)) }

    selectedCollectionName && loadCollection()
  }, [selectedCollectionName])

  const handleNewItemChange = (property: string, value: string | number | boolean) => {
    setNewItem({ ...newItem, [property]: value })
  }

  // Add new item to the selected collection
  const handleAddItem = () => {
    if (collection) {
      const updatedCollections = { ...collection, items: [...(Array.isArray(collection.items) ? collection.items : []), newItem] }
      setCollection(updatedCollections)
      addNewRowToDB(newItem, selectedCollectionName)
      setNewItem({})
    }
  }

  const showRows = () => {
    let columns: any = []
    if (collection?.items) {
      collection.items.map((element: any) => {
        for (const property in element) {
          console.log(element[property])

          columns.push(
            <td>{element[property]}</td>
          )
        }

      })
      return <tr>{...columns}</tr>
    }
  }


  return (
    <div>
      <h2 className='font-bold'>View Selected Collection Table/Rows</h2>
      <p>{selectedCollectionName}</p>
      <table>
        <thead>
          <tr>
            {collection?.properties && collection?.properties.map((property, index) => {
              return <th key={index}>{property.name}</th>
            })}
          </tr>
          {showRows()}
        </thead>
      </table>
      <div>
        <h3>Add an Item to {selectedCollectionName}</h3>
        {collection?.properties && collection.properties.map((property, index) => (
          property.name !== 'id' && (
            <div key={index}>
              <label>{property.name} ({property.type}): </label>
              <input
                type={property.type === 'number' ? 'number' : 'text'}
                onChange={(e) =>
                  handleNewItemChange(
                    property.name,
                    property.type === 'number'
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
              />
            </div>
          )
        ))}
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  )
}

export default CollectionViews