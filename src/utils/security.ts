const jwt = require('jsonwebtoken')
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { DecryptedData, Item, Single, User } from '../types'

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

// updated encryptdata / decryptdata / signiture chatgpt

export const encryptData = (data: Item | User) => {
  const json = JSON.stringify(data)

  // Generate AES key + IV
  const aesKey = crypto.randomBytes(32) // AES-256
  const iv = crypto.randomBytes(16)     // AES IV

  // Encrypt data using AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv)
  let encryptedData = cipher.update(json, 'utf8', 'base64')
  encryptedData += cipher.final('base64')

  // Encrypt AES key using RSA
  const encryptedKey = crypto.publicEncrypt(
    {
      key: process.env.PUBLIC_RSA_KEY as string,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    aesKey
  ).toString('base64')

  return {
    encryptedData,
    encryptedKey,
    iv: iv.toString('base64')
  }
}

export const generateSigniture = (data: Item | User) => {
  const sign = crypto.createSign('SHA256')
  sign.update(JSON.stringify(data))
  sign.end()
  const signBuffer = sign.sign(process.env.PRIVATE_RSA_KEY as string)
  return signBuffer.toString('base64')
}

export const decryptData = ({
  encryptedData,
  encryptedKey,
  iv
}: {
  encryptedData: string
  encryptedKey: string
  iv: string
}): Item | User => {
  // Decrypt AES key using RSA
  const aesKey = crypto.privateDecrypt(
    {
      key: process.env.PRIVATE_RSA_KEY as string,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    Buffer.from(encryptedKey, 'base64')
  )

  // Decrypt data using AES
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'))
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return JSON.parse(decrypted)
}

export const verifySigniture = (data: DecryptedData, signature: string): boolean => {
  const verify = crypto.createVerify('SHA256')
  verify.update(JSON.stringify(data))
  verify.end()
  return verify.verify(process.env.PUBLIC_RSA_KEY as string, signature, 'base64')
}
