import { cleanResponse, generateRowId, authorisationMiddleWare } from '@/utils'
import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// add optional header for user id later
export const POST = async (req: Request, { params }: { params: { modelId: string } }) => {
  const authHeader = await req.headers.get('Authorization')

  // verify token
  const checkToken = await authorisationMiddleWare(authHeader)
  if(checkToken) return checkToken

  const { modelId } = await params
  const body = await req.json()
  const ref = gun.get(modelId)

  const newData = {
    ...body,
    id: generateRowId()
  }

  ref.set(newData, (ack: Acknowledgment) => {
    if (ack.err) {
      return NextResponse.json({ message: 'Failed to save data' })
    }
  })

  return NextResponse.json({ message: `Data created`, body: newData })
}

export const GET = async (req: Request, { params }: { params: { modelId: string } }) => {
  const authHeader = await req.headers.get('Authorization')

  // verify token
  const checkToken = await authorisationMiddleWare(authHeader)
  if(checkToken) return checkToken

  const { modelId } = await params

  const ref = gun.get(modelId)

  const results: Item[] = []

  await ref.map().once((res, id) => {
    if (res) {
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

  return NextResponse.json(cleanResponse(results))
}
