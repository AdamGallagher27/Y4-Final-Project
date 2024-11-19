import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun(process.env.NEXT_PUBLIC_GUN_URL)

export const POST = async (req: Request, { params }: { params: { data: string } }) => {
  const { data } = await params
  const body = await req.json()
  const ref = gun.get(data)

  const newData = {
    data: body,
    userId: 'admin'
  }
  
  return new Promise((resolve) => {
    ref.set(newData, (ack: Acknowledgment) => {
      if (ack.err) {
        resolve(NextResponse.json({ message: 'Failed to save data' }));
      } else {
        resolve(NextResponse.json({ message: `Data created: ${String(data)}`, body: newData }));
      }
    });
  });
}

export const GET = async (req: Request, { params }: { params: { data: string } }) => {
  const { data } = await params

  const ref = gun.get(data)

  // fix me later
  const results: any[] = []

  await ref.map().once((res, id) => {
    if (res && res.userId === 'admin') {
      results.push({ id, ...res })
    }
  })

  // Gun needs to wait a second for GET to work
  // this doesnt work because its scoped to inside set time out
  // setTimeout(() => {
  //   return NextResponse.json(results)
  // }, 1000)

  // this is my temp solution to this issue
  await new Promise(resolve => setTimeout(resolve, 1000))

  return NextResponse.json(results)
}
