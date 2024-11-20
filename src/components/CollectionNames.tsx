import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  collectionNames: string[]
  updateSelectedCollection: (collectionName: string) => void
}

const CollectionNames = (props: Props) => {
  const { collectionNames, updateSelectedCollection } = props

  const handleClick = (collectionName: string) => {
    updateSelectedCollection(collectionName)
  }

  return (
    <div>
      <h2 className='font-bold'>Existing Collections Names</h2>
      <ul>
        {collectionNames.map(name => {
          return <li onClick={() => handleClick(name) } key={name}>{name}</li>
        })}
      </ul>
    </div>

  )
}

export default CollectionNames