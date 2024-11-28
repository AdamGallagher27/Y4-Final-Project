import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'models.json')
    const newModel: Model = await req.json()
    const modelsJson = await JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    modelsJson.push(newModel)

    fs.writeFileSync(filePath, JSON.stringify(modelsJson))

    console.log(newModel)

    return NextResponse.json({message: 'added to models success'})
  }
  catch (error) {
    return NextResponse.json({error: error})
  }

}