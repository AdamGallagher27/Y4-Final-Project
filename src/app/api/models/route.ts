import { NextResponse } from 'next/server'
import { Acknowledgment, Model } from '@/types'
import { authorisationMiddleWare } from '@/utils/security'
import Gun from 'gun'
import peers from '../../../../public/peers.json'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL, ...peers])

export const POST = async (req: Request) => {
  const authHeader = req.headers.get('Authorization')

  try {
    const checkToken = authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { newModel } = await req.json()
    const ref = gun.get('modelsDB')

    const gunCompatibleModel = {
      ...newModel,
      properties: JSON.stringify(newModel.properties),
    }

    ref.set(gunCompatibleModel, (ack: Acknowledgment) => {
      if (ack.err) {
        console.error(ack.err)
        return NextResponse.json({ message: 'Failed to save data', ok: false }, { status: 500 })
      }
    })

    return NextResponse.json({ message: 'Added to models successfully', ok: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error, ok: false }, { status: 500 })
  }
}

export const GET = async (req: Request) => {
  const authHeader = req.headers.get('Authorization')

  try {
    // verify token
    const checkToken = authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const ref = gun.get('modelsDB')
    const results: Model[] = []

    ref.map().once((res: Model) => {
      if (res) {
        results.push(res)
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ message: 'Got models successfully', body: results, ok: true }, { status: 201 })
  }
  catch (error) {
    return NextResponse.json({ error: error, ok: false }, { status: 500 })
  }
}