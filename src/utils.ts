const jwt = require('jsonwebtoken')
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const isOnClient = () => {
  if (typeof window !== undefined) {
    return true
  }

  return false
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

    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

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

      return NextResponse.json({ message: 'no auth token present' })
    }
  
    // get the token
    const token = authHeader.split(' ')[1]
  
    if (!verifyToken(token)) {
      return NextResponse.json({ message: 'error fetching, invalid token' })
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
