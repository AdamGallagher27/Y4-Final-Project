const jwt = require('jsonwebtoken')

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import {  startSession } from '@/utils'
const { generateKeyPair } = require('crypto') 


const createToken = (sessionData: string) => {
  const publicKey = process.env.PUBLIC_RSA_KEY

  if(publicKey) {
    return jwt.sign(sessionData, publicKey, { algorithm: 'RS256' })
  }
}

const verifyToken = (token: string) => {
  const privateKey = process.env.PRIVATE_RSA_KEY

  try {
    const decoded = jwt.verify(token, privateKey, { algorithms: ['RS256'] })

    if(decoded) {
      return true
    }

  } catch(error) {
    console.error(error)
  }

  return false
}


const appendTokenToEnv = (token: string) => {
  const envFilePath = path.resolve(process.cwd(), '.env')

  // check env exists
  if (!fs.existsSync(envFilePath)) {
    console.error('.env file does not exist')
    return
  }

  // read env data
  const envContent = fs.readFileSync(envFilePath)

  const appendedEnvContent = `${envContent}\nNEXT_PUBLIC_JWT_TOKEN=${token}`

  fs.writeFileSync(envFilePath, appendedEnvContent)
}

const generateRSAKeys = async () => {
  try {
    // use crypto to generate public / private keys
    const rsaKeyPair = await new Promise((resolve, reject) => {
      generateKeyPair(
        'rsa', 
        {
          modulusLength: 2048,
          publicKeyEncoding: { type: 'spki', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        },
        // fix any later
        (err: any, publicKey: any, privateKey: any) => {
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

// fix any later
const createEnvFile = (rsaKeyPair: any) => {
  const fileName = '.env'
  const filePath = path.resolve(fileName)

  if (!fs.existsSync(filePath)) {
    const defaultContent = `PUBLIC_RSA_KEY=${rsaKeyPair.publicKey.replace(/\n/g, '')}\nPRIVATE_RSA_KEY=${rsaKeyPair.privateKey.replace(/\n/g, '')}\nNEXT_PUBLIC_HOSTING_URL=http://localhost:3000/`
    
    fs.writeFileSync(filePath, defaultContent)
    console.log(`${fileName} created successfully.`)
  } else {
    console.error(`${fileName} already exists.`)
  }
}


export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'auth.json')

    const { walletId } = await req.json()
    
    // check if the auth.json file exists if not means it the first time logging in
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([{'firstTimeLogin':true, 'walletId': walletId }]))

      const rsaKeyPair = await generateRSAKeys()

      await createEnvFile(rsaKeyPair)

      const initialSession = await startSession(walletId)

      // console.log(initialSession)

      // const token = createToken(initialSession)

      // console.log('token : ' + token)

      // appendTokenToEnv(token)

      return NextResponse.json({ message: 'First-time login set to true' })
    }

    return NextResponse.json({ message: 'Not first-time logging in' })
  }
  catch (error) {
    return error
  }

}