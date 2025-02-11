import { v4 as uuidv4 } from 'uuid'

const isOnClient = () => {
  if (typeof window !== undefined) {
    return true
  }

  return false
}

// these two functions are the same but have different names 
// this is just for cleaner ui code
export const generateRowId = () => {
  return uuidv4()
}

export const generateModelId = () => {
  return Math.random().toString().substring(2, 8)
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


export const cleanResponse = (response: Item[]) => {
  return response.map(item => {
    const { _, ...newObject } = item
    return newObject
  })
}

export const updateAuthJSON = async (walletId: string) => {

  const url = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  
  // later replace with auth token which is generated when the user logs in for the first time
  const authToken = 'your-auth-token-here'

  try {
    const response = await fetch(`${url}api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        walletId: walletId,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error during fetch:', error)
  }
}
