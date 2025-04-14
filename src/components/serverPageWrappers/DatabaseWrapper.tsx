'use client'
import { Model } from '@/types'
import React, { useState } from 'react'
import InnerSideBar from '../generic/InnerSideBar'
import { CollectionPageWrapper } from '../collections/CollectionPageWrapper'

interface Props {
  models: Model[]
}

const DatabaseWrapper = ({models}: Props) => {
  const [allModels, setAllModels] = useState<Model[]>(models)
  const [selectedModel, setSelectedModel] = useState<Model>(models[0])

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