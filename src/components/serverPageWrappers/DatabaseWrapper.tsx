'use client'
import { Model } from '@/types'
import React, { useEffect, useState } from 'react'
import InnerSideBar from '../generic/InnerSideBar'
import { CollectionPageWrapper } from '../collections/CollectionPageWrapper'
import { getAllModelsFromIndexedDB, saveModelToIndexedDB } from '@/utils/indexDB'
import { getAllModelsFromGun } from '@/utils/api'

const DatabaseWrapper = () => {
  const [allModels, setAllModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<Model | undefined>()

  // check index db for models if there are none check the gun js database
  // this allows the user to access the cms from different clients
  // also improves performance
  useEffect(() => {
    const handleLoadModels = async () => {
      const modelsFromIndexDB = await getAllModelsFromIndexedDB()
  
      if (modelsFromIndexDB.length === 0) {
        const modelsFromGun = await getAllModelsFromGun()
        if (modelsFromGun) {
          setAllModels(modelsFromGun)

          for(const model of modelsFromGun) {
            saveModelToIndexedDB(model)
          }
        }
      } else {
        setAllModels(modelsFromIndexDB)
      }
    }
  
    handleLoadModels()    
  }, [])

  useEffect(() => {
    if(!selectedModel && allModels.length > 1) {
      setSelectedModel(allModels[0])
    }

  }, [allModels])
  
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