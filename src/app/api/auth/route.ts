import { NextResponse } from "next/server"
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
    const defaultContent = `PUBLIC_RSA_KEY=${rsaKeyPair.publicKey.replace(/\n/g, '')}\nPRIVATE_RSA_KEY=${rsaKeyPair.privateKey.replace(/\n/g, '')}`
    
    fs.writeFileSync(filePath, defaultContent)
    console.log(`${fileName} created successfully.`)
  } else {
    console.error(`${fileName} already exists.`)
  }
}


export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'auth.json')

    // console.log('public key = ' + process.env.PUBLIC_RSA_KEY)

    
    // check if the auth.json file exists if not means it the first time logging in
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]))

      const rsaKeyPair = await generateRSAKeys()

      createEnvFile(rsaKeyPair)

      console.log('first time logging in')
    }

    // const isLoggedInArray = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // if (isLoggedInArray.length === 0) {

    //   isLoggedInArray.push({ firstTimeLogin: true })

    //   fs.writeFileSync(filePath, JSON.stringify(isLoggedInArray))
    //   return NextResponse.json({ message: 'First-time login set to true' })
    // }

    return NextResponse.json({ message: 'First-time login set to true' })
  }
  catch (error) {
    return error
  }

}