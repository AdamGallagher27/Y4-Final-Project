'use client'
import CollectionCreator from '@/components/collections/CollectionCreator'
import CollectionNames from '@/components/collections/CollectionNames'
import CollectionView from '@/components/collections/CollectionViews'
import { getAllModelNames } from '@/utils'
import { useEffect, useState } from 'react'

export default function Home() {

  const [selectedCollection, setSelectedCollection] = useState<string>('')
  const [collectionNames, setCollectionNames] = useState<string[]>([])

  useEffect(() => {
    const loadCollectionNamesArray = async () => {
      setCollectionNames(await getAllModelNames())
    }

    loadCollectionNamesArray()

  }, [collectionNames])

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
