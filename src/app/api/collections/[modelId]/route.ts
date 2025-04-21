import { Acknowledgment, EncryptedItem, Item } from '@/types'
import { cleanResponse, validateOnServer,  } from '@/utils'
import { getModelProperties, saveResponseStatus } from '@/utils/api'
import { authorisationMiddleWare, generateSigniture, encryptData, generateRowId, decryptData, verifySigniture } from '@/utils/security'
import Gun from 'gun'
import { NextResponse } from 'next/server'
import peers from '../../../../../public/peers.json'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL, ...peers])

// create row route
export const POST = async (req: Request, { params }: { params: { modelId: string } }) => {
  const currentUrl = req.url

  // this optional header is used to ignore saving the api response
  const ignoreHeader = req.headers.get('Ignore')
  const authHeader = req.headers.get('Authorization')

  try {

    // verify token
    const checkToken = authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { modelId } = await params
    const body = await req.json() as Item

    const properties = await getModelProperties(modelId)

    // validate body against its models properties
    const notValid = validateOnServer(body, properties)
    if(notValid) return notValid

    const ref = gun.get(modelId)

    if (!body || !modelId) {
      !ignoreHeader && saveResponseStatus(currentUrl, 400)
      return NextResponse.json({ message: 'invalid params', ok: false }, { status: 400 })
    }

    // generate an data integrity signiture / encrypt data
    const signiture = generateSigniture(body)
    const encryptedData = encryptData(body)

    const newData = {
      ...encryptedData,
      signiture,
      id: generateRowId()
    }

    ref.set(newData, (ack: Acknowledgment) => {
      if (ack.err) {
        console.error(ack.err)
        !ignoreHeader && saveResponseStatus(currentUrl, 500)
        return NextResponse.json({ message: 'Failed to save data', ok: false }, { status: 500 })
      }
    })

    !ignoreHeader && saveResponseStatus(currentUrl, 201)
    return NextResponse.json({ message: 'Data created', body: 'newData', ok: true }, { status: 201 })
  }

  catch (error) {
    console.error(error)
    !ignoreHeader && saveResponseStatus(currentUrl, 400)
    return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
  }
}

// get all rows route
export const GET = async (req: Request, { params }: { params: { modelId: string } }) => {

  const currentUrl = req.url
  
  // this optional header is used to ignore saving the api response
  const ignoreHeader = req.headers.get('Ignore')
  const authHeader = req.headers.get('Authorization')
  
  try {

    // verify token
    const checkToken = authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { modelId } = await params

    const ref = gun.get(modelId)
    const results: Item[] = []

    ref.map().once((res: EncryptedItem) => {
      if (res && res.encryptedData && res.signiture && res.id) {
        const decryptedData = decryptData(res)
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
      !ignoreHeader && saveResponseStatus(currentUrl, 404)
      return NextResponse.json({ message: 'No rows found', ok: true, }, { status: 404 })
    }

    !ignoreHeader && saveResponseStatus(currentUrl, 200)
    return NextResponse.json({ message: 'Got all rows successfully', ok: true, body: cleanResponse(results) }, { status: 200 })
  }
  catch (error) {
    console.error(error)
    !ignoreHeader && saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
  }
}
