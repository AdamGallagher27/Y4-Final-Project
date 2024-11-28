import { v4 as uuidv4 } from 'uuid';

const isOnClient = () => {
  if (typeof window !== undefined) {
    return true
  }

  return false
}

export const generateRowId = () => {
  return uuidv4()
}

const getAllModels = async () => {

  try {

    if (isOnClient()) {
      const response = await fetch('/models.json')

      const models = await response.json()

      return models
    }

  }
  catch (error) {
    console.error(error)
  }
}

export const getAllModelNames = async () => {
  const models = await getAllModels()
  return models.map((model: Model) => {
    return model.name
  })
}

export const getModel = async (modelName: string) => {
  const models = await getAllModels()
  return models.filter((model: Model) => {
    return model.name === modelName
  })[0]
}