import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'singles.json')
    const newSingle: Single = await req.json()
    const singlesJson = await JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    singlesJson.push(newSingle)

    fs.writeFileSync(filePath, JSON.stringify(singlesJson))

    return NextResponse.json({ message: 'Added single value successfully', ok: true }, { status: 201 })
  }
  catch (error) {
    return NextResponse.json({ error: error, ok: false }, { status: 500 })
  }

}