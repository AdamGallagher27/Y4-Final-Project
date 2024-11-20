'use client'
import CollectionCreator from '@/components/CollectionCreator'
import CollectionNames from '@/components/CollectionNames'
import CollectionView from '@/components/CollectionViews'
import { useState } from 'react'

export default function Home() {

  const [selectedCollection, setSelectedCollection] = useState<string>('')
  const [collectionNames, setCollectionNames] = useState<string[]>(['car test mock', 'hospital test mock'])

  const addToCollectionNames = (collectionName: string) => {
    setCollectionNames((prevItems) => [...prevItems, collectionName])
  }

  const updateSelectedCollection = (collectionName: string) => {
    setSelectedCollection(collectionName)
  }

  return (
    <div>
      <CollectionNames collectionNames={collectionNames} updateSelectedCollection={updateSelectedCollection} />
      <CollectionCreator addToCollectionNames={addToCollectionNames} />
      <CollectionView selectedCollectionName={selectedCollection} />
    </div>
  )
}
