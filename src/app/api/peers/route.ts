import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const POST = async (req: Request) => {
  try {
    const filePath = path.join(process.cwd(), 'public', 'peers.json')
    let peersJson: string[] = []

    if (fs.existsSync(filePath)) {
      peersJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }

    const { peer }: { peer: string } = await req.json()
    peersJson.push(peer)

    fs.writeFileSync(filePath, JSON.stringify(peersJson))

    return NextResponse.json({ message: 'Added peer value successfully', ok: true }, { status: 201 })
  }
  catch (error) {
    return NextResponse.json({ error: error, ok: false }, { status: 500 })
  }
}
