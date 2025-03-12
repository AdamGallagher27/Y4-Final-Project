const jwt = require('jsonwebtoken')
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { Collection, DecryptedData, EncryptedItem, Item, Model, Property, Single, StatusFromAPI, User } from './types'
import { Dispatch, SetStateAction } from 'react'

const isOnClient = () => {
  if (typeof window !== undefined) {
    return true
  }

  return false
}

export const refreshPage = () => {
  if(isOnClient()) window.location.reload()
}

// these three functions are the same but have different names 
// this is just for cleaner ui code
export const generateRowId = () => {
  return uuidv4()
}

export const generateModelId = () => {
  return Math.random().toString().substring(2, 8)
}

const generateSessionId = () => {
  return uuidv4()
}

// returns a stringified session data object which will be converted
// into a jwt token for api access
export const startSession = (walletId: string) => {
  const sessionId = generateSessionId()
  const sessionData = { walletId, sessionId, createdAt: Date.now() }
  return JSON.stringify(sessionData)
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

export const cleanResponse = (response: Item[]) => {
  return response.map(item => {
    // eslint-disable-next-line
    const { _, ...newObject } = item
    return newObject
  })
}


const verifyToken = (token: string) => {
  try {
    const publicKey = process.env.PUBLIC_RSA_KEY

    if (!token) {
      console.error('Token is missing!')
      return false
    }

    if (!publicKey) {
      console.error('Public key is missing!')
      return false
    }

    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })

    if (decoded) {
      return true
    }

    return false

  } catch (error) {
    console.error('Error verifying the token:', error)
    return false
  }

}

// this technically is not middleware but the way next handles middleware
// is that it creates an edge environment and you define the paths where the middleware runs
// unfortunatly you cant use node packages in edge envs
// its easier to just make this function and treat it like middleware in resource routes
export const authorisationMiddleWare = (authHeader: string | null) => {
  if (!authHeader) {
    return NextResponse.json({ message: 'no auth token present', ok: false }, { status: 401 })
  }

  // get the token
  const token = authHeader.split(' ')[1]

  if (!verifyToken(token)) {
    return NextResponse.json({ message: 'error fetching, invalid token', ok: false }, { status: 401 })
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


export const encryptData = (data: Item | User) => {
  const buffer = Buffer.from(JSON.stringify(data))
  const encrypted = crypto.publicEncrypt(process.env.PUBLIC_RSA_KEY as string, buffer)

  return encrypted.toString('base64')
}

export const generateSigniture = (data: Item | User) => {
  const sign = crypto.createSign('SHA256')
  sign.update(JSON.stringify(data))

  const signBuffer = sign.sign(process.env.PRIVATE_RSA_KEY as string)

  return signBuffer.toString('base64')
}

export const decryptData = (encryptedData: string): Item | User | Single => {
  const buffer = Buffer.from(encryptedData, 'base64')
  const decrypted = crypto.privateDecrypt(process.env.PRIVATE_RSA_KEY as string, buffer)
  return JSON.parse(decrypted.toString('utf-8'))
}

export const verifySigniture = (data: DecryptedData, signiture: string): boolean => {
  const verify = crypto.createVerify('SHA256')
  verify.update(JSON.stringify(data))
  return verify.verify(process.env.PUBLIC_RSA_KEY as string, signiture, 'base64')
}

// returns the id (pointer) of an entry in gun db
export const getGunEntryId = (entry: EncryptedItem) => {
  if (entry && entry._ && entry._['#']) {
    return entry._['#']
  }
}

export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

export const validatePassword = (password: string) => {
  const regex = /^.{8,}$/
  return regex.test(password)
}

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

      return responses as StatusFromAPI[]
    }
  }
  catch (error) {
    console.error(error)
  }
}

export const addRowToCollection = async (modelId: string, body: Item) => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN

  try {
    const response = await fetch(`${apiUrl}api/collections/${modelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
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
        'Authorization': `Bearer ${authToken}`
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
        'Authorization': `Bearer ${authToken}`
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
        'Authorization': `Bearer ${authToken}`
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
        'Authorization': `Bearer ${authToken}`
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
        'Authorization': `Bearer ${authToken}`
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
        'Authorization': `Bearer ${authToken}`
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

export const getAllCollectionRows = async (modelId: string): Promise<Collection[] | undefined> => {

  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const response = await fetch(`${apiUrl}api/collections/${modelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
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

export const getAllUsers = async (): Promise<User[] | undefined> => {
  const apiUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'
  const authToken = process.env.NEXT_PUBLIC_API_TOKEN
  try {
    const response = await fetch(`${apiUrl}api/userAuth`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
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

const validateField = (name: string, value: string, properties: Property[]) => {
  const property = properties.find((prop) => prop.name === name)

  if (!property) return

  if (property.name === 'id') return

  if (value === '') {
    return `${property.name} is required.`
  }

  if (property.type === 'number' && isNaN(Number(value))) {
    return `${property.name} must be a valid number.`
  }

  if (property.type === 'string') {

    if (value.length < 3) {
      return `${property.name} must be at least 3 characters long.`
    }

    const regex = /^[a-zA-Z0-9 ]+$/
    if (!regex.test(value)) {
      return `${property.name} can only contain letters, numbers, and spaces.`
    }
  }

}

export const validateForm = (
  form: { [key: string]: string }, 
  properties: Property[], 
  setErrors: Dispatch<SetStateAction<{ [key: string]: string }>>
) => {
  const formErrors: { [key: string]: string } = {}

  // by default keep has error as false then check if error exists 
  let isValid = true

  properties.forEach((property) => {
    const value = form[property.name] || ''
    const error = validateField(property.name, value, properties)

    if (error) {
      formErrors[property.name] = error
      isValid = false
    }
  })

  setErrors(formErrors)
  return isValid
}


export const getPillColour = (method: string) => {

  let methodColour

  if(method === 'GET') {
    methodColour = 'bg-green-500'
  }
  else if(method === 'POST') {
    methodColour = 'bg-blue-500'
  }
  else if(method === 'PUT') {
    methodColour = 'bg-blue-500'
  }
  else {
    methodColour = 'bg-red-500'
  }

  return methodColour
}

export const generatePropetiesArray = (selectedType: string) => {
  return [{
    'name': 'id',
    'type': 'string'
  }, {
    'name': 'value',
    'type': selectedType
  }]
}