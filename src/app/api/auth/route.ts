import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
const { generateKeyPair } = require('crypto') 

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

      createEnvFile(rsaKeyPair)

      return NextResponse.json({ message: 'First-time login set to true' })
    }

    return NextResponse.json({ message: 'Not first-time logging in' })
  }
  catch (error) {
    return error
  }

}