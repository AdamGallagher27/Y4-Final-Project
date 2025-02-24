import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Model } from '@/types'

export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'models.json')
    const newModel: Model = await req.json()
    const modelsJson = await JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    modelsJson.push(newModel)

    fs.writeFileSync(filePath, JSON.stringify(modelsJson))

    return NextResponse.json({ message: 'Added to models successfully', ok: true }, { status: 201 })
  }
  catch (error) {
    return NextResponse.json({ error: error, ok: false }, { status: 500 })
  }

}