// chatgpt
import { openDB } from 'idb'
import { Model } from '@/types'

// this makes sure each instance of the cms is unique and doesnt share models
// on the same client
const DB_NAME = 'indexDB-${process.env.NEXT_PUBLIC_IDB_STORE}'
const STORE_NAME = `models-${process.env.NEXT_PUBLIC_IDB_STORE}`

export const getDb = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'modelId' })
      }
    },
  })
}

export const saveModelToIndexedDB = async (model: Model) => {
  const db = await getDb()
  await db.put(STORE_NAME, model)
}

export const getAllModelsFromIndexedDB = async (): Promise<Model[]> => {
  const db = await getDb()

  return await db.getAll(STORE_NAME)
}
