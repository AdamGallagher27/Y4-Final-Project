import { cleanResponse, generateRowId } from '@/utils'
import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun(process.env.NEXT_PUBLIC_GUN_URL)

export const POST = async (req: Request, { params }: { params: { name: string } }) => {
  const { name } = await params
  const body = await req.json()
  const ref = gun.get(name)

  const newData = {
    ...body,
    userId: 'admin',
    id: generateRowId()
  }

  ref.set(newData, (ack: Acknowledgment) => {
    if (ack.err) {
      return NextResponse.json({ message: 'Failed to save data' })
    }
  })

  return NextResponse.json({ message: `Data created: ${String(name)}`, body: newData })
}

export const GET = async (req: Request, { params }: { params: { name: string } }) => {
  const { name } = await params

  const ref = gun.get(name)

  const results: Item[] = []

  await ref.map().once((res, id) => {
    if (res && res.userId === 'admin') {
      results.push(res)
    }
  })

  // Gun needs to wait a second for GET to work
  // this doesnt work because its scoped to inside set time out
  // setTimeout(() => {
  //   return NextResponse.json(results)
  // }, 1000)

  // this is my temp solution to this issue
  await new Promise(resolve => setTimeout(resolve, 1000))

  return NextResponse.json(cleanResponse(results)
)
}
