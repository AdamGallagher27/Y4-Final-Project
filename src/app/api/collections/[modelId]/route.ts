import { Acknowledgment, EncryptedItem, Item } from '@/types'
import { cleanResponse, generateRowId, authorisationMiddleWare, generateSigniture, encryptData, decryptData, verifySigniture, saveResponseStatus } from '@/utils'
import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// create row route
export const POST = async (req: Request, { params }: { params: { modelId: string } }) => {
  const currentUrl = req.url

  try {
    const authHeader = await req.headers.get('Authorization')

    // verify token
    const checkToken = await authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { modelId } = await params
    const body = await req.json() as Item
    const ref = gun.get(modelId)

    if (!body || !modelId) {
      saveResponseStatus(currentUrl, 400)
      return NextResponse.json({ message: 'invalid params', ok: false }, { status: 400 })
    }

    // generate an data integrity signiture / encrypt data
    const signiture = generateSigniture(body)
    const encryptedData = encryptData(body)

    const newData = {
      encryptedData,
      signiture,
      id: generateRowId()
    }

    ref.set(newData, (ack: Acknowledgment) => {
      if (ack.err) {
        console.error(ack.err)
        saveResponseStatus(currentUrl, 500)
        return NextResponse.json({ message: 'Failed to save data', ok: false }, { status: 500 })
      }
    })

    saveResponseStatus(currentUrl, 201)
    return NextResponse.json({ message: 'Data created', body: newData, ok: true }, { status: 201 })
  }

  catch (error) {
    console.error(error)
    saveResponseStatus(currentUrl, 400)
    return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
  }
}

// get all rows route
export const GET = async (req: Request, { params }: { params: { modelId: string } }) => {

  const currentUrl = req.url
  
  try {
    const authHeader = await req.headers.get('Authorization')

    // verify token
    const checkToken = await authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { modelId } = await params

    const ref = gun.get(modelId)
    const results: Item[] = []

    ref.map().once((res: EncryptedItem) => {
      if (res && res.encryptedData && res.signiture && res.id) {
        const decryptedData = decryptData(res.encryptedData)
        const isValid = verifySigniture(decryptedData, res.signiture)

        // if the signiture is valid it means the data has not been tampered with outside of the api
        if (isValid) {
          results.push({ ...decryptedData, id: res.id })
        }
        else {
          // alert the user to the fact that unauth data has been altered / add in roll back feature
          console.error('unauth user altered data start rollback')
        }
      }
    })

    // Gun needs to wait a second for GET to work
    // this doesnt work because its scoped to inside set time out
    // setTimeout(() => {
    //   return NextResponse.json(results)
    // }, 1000)

    // this is my temp solution to this issue
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (results.length === 0) {
      saveResponseStatus(currentUrl, 404)
      return NextResponse.json({ message: 'No rows found', ok: false, }, { status: 404 })
    }

    saveResponseStatus(currentUrl, 200)
    return NextResponse.json({ message: 'Got all rows successfully', ok: true, body: cleanResponse(results) }, { status: 200 })
  }
  catch (error) {
    console.error(error)
    saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
  }


}
