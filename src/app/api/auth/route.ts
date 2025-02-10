import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'auth.json')

    // // add type later
    // const params = await req.json
    
    // check if the auth.json file exists if not means it the first time logging in
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]))

      console.log('first time logging in')
    }

    // const isLoggedInArray = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // if (isLoggedInArray.length === 0) {

    //   isLoggedInArray.push({ firstTimeLogin: true })

    //   fs.writeFileSync(filePath, JSON.stringify(isLoggedInArray))
    //   return NextResponse.json({ message: 'First-time login set to true' })
    // }

    return NextResponse.json({ message: 'fdjlsfjdls' })
  }
  catch (error) {
    return error
  }

}