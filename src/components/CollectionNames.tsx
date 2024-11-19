import React from 'react'

type Props = {
  collectionNames: string[]
}

const CollectionNames = (props: Props) => {
  const { collectionNames } = props


  return (
    <div>
      <h2>Existing Collections</h2>
      <ul>
        {JSON.stringify(collectionNames)}
      </ul>
    </div>

  )
}

export default CollectionNames