'use client'
import { Model } from '@/types'
import React, { useEffect, useState } from 'react'
import InnerSideBar from '../generic/InnerSideBar'
import { CollectionPageWrapper } from '../collections/CollectionPageWrapper'
import { getAllModelsFromIndexedDB } from '@/utils/indexDB'

const DatabaseWrapper = () => {
  const [allModels, setAllModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<Model | undefined>()

  useEffect(() => {
    const handleLoadModels = async () => {
      const models = await getAllModelsFromIndexedDB()
      setAllModels(models)

      if (models.length > 0 && !selectedModel) {
        setSelectedModel(models[0])
      }
    }

    handleLoadModels()
  }, [])

  return (
    <>
      <InnerSideBar
        allModels={allModels}
        setAllModels={setAllModels}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <div className='p-4 w-full'>
        {selectedModel && <CollectionPageWrapper model={selectedModel} />}
      </div>
    </>
  )
}

export default DatabaseWrapper