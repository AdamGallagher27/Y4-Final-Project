const jwt = require('jsonwebtoken')

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { startSession } from '@/utils'
import { RSAKeyPair } from '@/types'
const { generateKeyPair } = require('crypto')


const createToken = (sessionData: string, privateKey: string) => {
  if (privateKey) {
    return jwt.sign(sessionData, privateKey, { algorithm: 'RS256' })
  }
}

const generateRSAKeys = async () => {
  try {
    // use crypto to generate public / private keys
    const rsaKeyPair = await new Promise<{ publicKey: string, privateKey: string }>((resolve, reject) => {
      generateKeyPair(
        'rsa',
        {
          modulusLength: 2048,
          publicKeyEncoding: { type: 'spki', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        },

        (err: Error, publicKey: string, privateKey: string) => {
          if (err) reject(err)
          else resolve({ publicKey, privateKey })
        }
      )
    })

    return rsaKeyPair

  } catch (error) {
    console.error(error)
  }
}

const createEnvFile = (rsaKeyPair: RSAKeyPair, walletId: string) => {
  const fileName = '.env'
  const filePath = path.resolve(fileName)

  const initialSession = startSession(walletId)
  const apiToken = createToken(initialSession, rsaKeyPair.privateKey)

  if (!fs.existsSync(filePath)) {
    const defaultContent = `PUBLIC_RSA_KEY="${rsaKeyPair.publicKey}"\nPRIVATE_RSA_KEY="${rsaKeyPair.privateKey}"\nNEXT_PUBLIC_HOSTING_URL="http://localhost:3000/"\nNEXT_PUBLIC_GUN_URL="https://gun-manhattan.herokuapp.com/gun"\nNEXT_PUBLIC_API_TOKEN="${apiToken}"`

    fs.writeFileSync(filePath, defaultContent)
    console.log(`${fileName} created successfully.`)
  } else {
    console.error(`${fileName} already exists.`)
  }
}


export const POST = async (req: NextRequest) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'auth.json')

    const { walletId } = await req.json()

    // check if the auth.json file exists if not means it the first time logging in
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([{ 'firstTimeLogin': true, 'walletId': walletId }]))

      const rsaKeyPair = await generateRSAKeys()

      if (rsaKeyPair) {
        await createEnvFile(rsaKeyPair, walletId)
      }

      return NextResponse.json({ message: 'First-time login set to true', ok: true }, { status: 201 })
    }

    return NextResponse.json({ message: 'Not first-time logging in', ok: true }, { status: 200 })
  }
  catch (error) {
    return NextResponse.json({ message: 'An Error occoured', error: error, ok: false }, { status: 500 })
  }
}