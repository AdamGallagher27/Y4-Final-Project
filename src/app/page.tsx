'use client'
import CollectionCreator from '@/components/collections/CollectionCreator'
import CollectionNames from '@/components/collections/CollectionNames'
import CollectionView from '@/components/collections/CollectionViews'
import { ConnectWalletButton } from '@/components/metamask/ConnectWalletButton'
import { getAllModelNames } from '@/utils'
import { MetaMaskProvider } from '@metamask/sdk-react'
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

  // use env host var later
  const host = 'http://localhost:3000/'

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: host,
    },
  }

  return (
    <div>
      <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
        <ConnectWalletButton />
      </MetaMaskProvider>
      <CollectionNames collectionNames={collectionNames} updateSelectedCollection={updateSelectedCollection} />
      <CollectionCreator addToCollectionNames={addToCollectionNames} />
      <CollectionView selectedCollectionName={selectedCollection} />
    </div>
  )
}
