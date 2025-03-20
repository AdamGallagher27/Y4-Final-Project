
import { isOnClient } from '.'
import { Collection, EncryptedItem, Item, Model, StatusFromAPI, User } from '../types'

export const saveResponseStatus = async (url: string, status: number) => {

  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'

  try {
    const response = await fetch(`${apiUrl}api/saveResponse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, status }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error saving API response status:', error)
  }
}

export const getResponseStatus = async (): Promise<StatusFromAPI[] | undefined> => {

  try {
    if (isOnClient()) {
      const response = await fetch('/response.json')

      const responses = await response.json()

      return responses.reverse() as StatusFromAPI[]
    }
  }
  catch (error) {
    console.error(error)
  }
}

export const getAllCollectionRows = async (modelId: string): Promise<Collection[] | undefined> => {

  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const response = await fetch(`${apiUrl}api/collections/${modelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData.body
  } catch (error) {
    console.error('Error saving API response status:', error)
  }
  return
}

export const addRowToCollection = async (modelId: string, body: Item) => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN

  try {
    const response = await fetch(`${apiUrl}api/collections/${modelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
      body: JSON.stringify({ ...body }),
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData.body as EncryptedItem 
  }
  catch(error) {
    console.error('Error saving API response status:', error)
  }
}

export const updateCollectionRow = async (modelId: string, body: Item) => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN

  try {
    const response = await fetch(`${apiUrl}api/collections/${modelId}/${body.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
      body: JSON.stringify({ ...body }),
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData
  }
  catch(error) {
    console.error('Error saving API response status:', error)
  }
}

export const deleteRow = async (modelId: string, rowId: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN  

  try {
    const response = await fetch(`${apiUrl}api/collections/${modelId}/${rowId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error deleting data:', error)
  }
  return
}

export const deleteSingle = async (singleId: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN  

  try {
    const response = await fetch(`${apiUrl}api/single/${singleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error('Error deleting data:', error)
  }
  return
}

export const addNewSingle = async (single: Item): Promise<Item[] | undefined> => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const response = await fetch(`${apiUrl}api/single/${single.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
      body: JSON.stringify({value: single.value})
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData.singles
  } catch (error) {
    console.error('Error saving API response status:', error)
  }
  return
}

export const updateSingle = async (single: Item): Promise<Item[] | undefined> => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const response = await fetch(`${apiUrl}api/single/${single.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
      body: JSON.stringify({value: single.value})
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData.singles
  } catch (error) {
    console.error('Error saving API response status:', error)
  }
  return
}

export const getAllSingles = async (): Promise<Item[] | undefined> => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const response = await fetch(`${apiUrl}api/single`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData.singles
  } catch (error) {
    console.error('Error saving API response status:', error)
  }
  return
}

export const getAllUsers = async (): Promise<User[] | undefined> => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const response = await fetch(`${apiUrl}api/userAuth`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'Ignore': 'ignore'
      },
    })

    if (!response.ok) {
      console.error('Network response was not ok')
    }

    const responseData = await response.json()
    return responseData.body
  } catch (error) {
    console.error('Error saving API response status:', error)
  }
}


export const updateAuthJSON = async (walletId: string) => {

  const url = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'

  try {
    const response = await fetch(`${url}api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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



export const getAllModels = async (): Promise<Model[] | undefined> => {

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
  return
}

export const getAllModelNames = (models: Model[] | undefined) => {

  if (!models) return

  return models.map((model: Model) => {
    return model.name
  })
}