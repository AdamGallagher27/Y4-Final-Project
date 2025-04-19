// chatgpt
import { openDB } from 'idb'
import { Model } from '@/types'

const DB_NAME = 'indexDB'
const STORE_NAME = 'models'

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
