import React, { useEffect, useState } from 'react'
import models from '../models/models.json' assert { type: 'json' }
import { findSelectedModel } from '@/utils'

type Props = {
  selectedCollectionName: string

}

const mock = { 'name': 'car test mock', 'properties': [{ 'name': 'car_make', 'type': 'string' }, { 'name': 'year_bought', 'type': 'number' }, { 'name': 'has_insurance', 'type': 'boolean' }], 'items': [] }


const CollectionViews = (props: Props) => {

  const { selectedCollectionName } = props
  const [collection, setCollection] = useState<Collection | undefined>()
  const [newItem, setNewItem] = useState<any>()


  // get the data from gun later for now just use mocked example
  // also in future add check for if the model is not saved locally then get data from api

  useEffect(() => {
    // fetchModel(selectedCollectionName)
    setCollection(findSelectedModel(models, selectedCollectionName))

    // get the data from api

  }, [selectedCollectionName])

  // fix any later
  const handleNewItemChange = (property: string, value: string | number | boolean) => {
    setNewItem({ ...newItem, [property]: value })
  }

  // Add new item to the selected collection
  const handleAddItem = () => {
    if (collection) {
      const updatedCollections = { ...collection, items: [...(Array.isArray(collection.items) ? collection.items : []), newItem] }
      setCollection(updatedCollections)
      setNewItem({})
    }
  }

  const showRows = () => {
    if (collection?.items) {
      collection.items.map((item: any) => {

        let columns = []

        for(const column in item) {
          columns.push(column)
        }


        return <tr>
        </tr>
      })
    }
  }

  return (
    <div>
      {JSON.stringify(collection)}
      <h2 className='font-bold'>View Selected Collection Table/Rows</h2>
      <p>{selectedCollectionName}</p>
      {/* <p className='border-solid border-2 border-sky-500'>{mock.name}</p> */}

      <table>
        <thead>
          <tr>
            {collection && collection.properties.map((property, index) => {
              // const name = {property}
              return <th key={index}>{property.name}</th>
            })}
          </tr>
          <tr>
          </tr>
        </thead>
      </table>

      <div>
        <h3>Add an Item to {selectedCollectionName}</h3>
        {collection && collection.properties.map((property, index) => (
          <div key={index}>
            <label>{property.name} ({property.type}): </label>
            <input
              type={property.type === 'number' ? 'number' : 'text'}
              // value={property.name || ''}
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
        ))}
        <button onClick={handleAddItem}>Add Item</button>
      </div>

    </div>
  )
}

export default CollectionViews