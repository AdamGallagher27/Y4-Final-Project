'use client'
import CollectionCreator from '@/components/CollectionCreator'
import CollectionNames from '@/components/CollectionNames'
import CollectionView from '@/components/CollectionView'
import { useState } from 'react'

export default function Home() {

  const [selectedCollection, setSelectedCollection] = useState<string>('')
  const [collectionNames, setCollectionNames] = useState<string[]>([])

  const addToCollectionNames = (collectionName: string) => {
    setCollectionNames((prevItems) => [...prevItems, collectionName]);
  };

  return (
    <div>
      <h1>Create a New Collection</h1>
      <CollectionNames collectionNames={collectionNames} />
      <CollectionCreator addToCollectionNames={addToCollectionNames} />
      <CollectionView collectionName={selectedCollection} />
    </div>
  )
}
