import { Acknowledgment, DecryptedData, EncryptedItem, Item } from '@/types'
import { getGunEntryId } from '@/utils'
import { saveResponseStatus } from '@/utils/api'
import { authorisationMiddleWare, decryptData, verifySigniture, generateSigniture, encryptData } from '@/utils/security'
import Gun from 'gun'
import { NextResponse } from 'next/server'
import peers from '../../../../../public/peers.json'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL, ...peers])

// get selected single from db
export const GET = async (req: Request, { params }: { params: { singleId: string } }) => {

  const currentUrl = req.url

  // this optional header is used to ignore saving the api response
	const ignoreHeader = req.headers.get('Ignore')
  const authHeader = req.headers.get('Authorization')

  try {

    // verify token
    const checkToken = authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { singleId } = await params

    const ref = gun.get('single')
    let result: Item[] = []


    ref.map().once((res: EncryptedItem) => {
      if (res) {
        const decryptedData = decryptData(res) as Item
        const isValid = verifySigniture(decryptedData, res.signiture)

        // if the signiture is valid it means the data has not been tampered with outside of the api
        if (isValid) {
          decryptedData.id === singleId && result.push(decryptedData)
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

    if (await result === null || await result === undefined) {
      !ignoreHeader && saveResponseStatus(currentUrl, 404)
      return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 })
    }

    !ignoreHeader && saveResponseStatus(currentUrl, 200)
    return NextResponse.json({ singles: result, ok: true, message: 'Retrieved singles successfully' }, { status: 200 })
  }
  catch (error) {
    console.error(error)
    !ignoreHeader && saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
  }
}


// create single route 
export const POST = async (req: Request, { params }: { params: { singleId: string } }) => {

  const currentUrl = req.url

  try {
    const authHeader = await req.headers.get('Authorization')

    // verify token
    const checkToken = await authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken
    const { singleId } = await params

    const { value } = await req.json()

    if (value === undefined || value === null) {
      saveResponseStatus(currentUrl, 400)
      return NextResponse.json({ message: 'invalid params', ok: false }, { status: 400 })
    }

    const ref = gun.get('single')

    const body = { id: singleId, value: value }

    // generate an data integrity signiture / encrypt data
    const signiture = generateSigniture(body)
    const encryptedData = encryptData(body)

    const newData = {
      ...encryptedData,
      signiture,
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
    saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error }, { status: 500 })
  }
}

// update single
export const PUT = async (req: Request, { params }: { params: { singleId: string } }) => {

  const currentUrl = req.url

  try {
    const authHeader = await req.headers.get('Authorization')

    // verify token
    const checkToken = await authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { singleId } = await params

    const { value } = await req.json()

    if (value === undefined || value === null) {
      saveResponseStatus(currentUrl, 400)
      return NextResponse.json({ message: 'invalid params', ok: false }, { status: 400 })
    }

    const ref = gun.get('single')

    const results: DecryptedData = {}

    ref.map().once((res: EncryptedItem) => {
      if (res) {
        const decryptedData = decryptData(res) as Item
        const isValid = verifySigniture(decryptedData, res.signiture)

        // if the current entry is valid and the id matches the row id param
        // create a new body and add it as a property to results
        if (isValid && decryptedData.id === singleId) {

          const newBody = { value: value, id: singleId }

          const newBodyEncrypted = {
            ...encryptData(newBody),
            signiture: generateSigniture(newBody),
          }

          results[getGunEntryId(res)] = newBodyEncrypted
        }

        // if the entry is valid but does not match 
        // dont edit it and add it to results
        else if (isValid) {
          results[getGunEntryId(res)] = res
        }

        else {
          // alert the user to the fact that unauth data has been altered / add in roll back feature
          console.error('unauth user altered data start rollback')
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

    ref.put(results, (ack: Acknowledgment) => {
      if (ack.err) {
        console.error(ack.err)
        saveResponseStatus(currentUrl, 500)
        return NextResponse.json({ message: 'Failed to update data', ok: false }, { status: 500 })
      }
    })

    saveResponseStatus(currentUrl, 201)
    return NextResponse.json({ message: 'Data updated', ok: true }, { status: 201 })
  }

  catch (error) {
    console.error(error)
    saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error }, { status: 500 })
  }
}

// delete single
export const DELETE = async (req: Request, { params }: { params: { singleId: string } }) => {

  const currentUrl = req.url

  try {
    const authHeader = await req.headers.get('Authorization')

    // verify token
    const checkToken = await authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { singleId } = await params

    const ref = gun.get('single')

    let singleToDeleteId: string | undefined

    ref.map().once((res: EncryptedItem) => {
      if (res) {
        const decryptedData = decryptData(res) as Item
        const isValid = verifySigniture(decryptedData, res.signiture)

        if (isValid && decryptedData.id === singleId) {
          singleToDeleteId = getGunEntryId(res)
        }

        else if (!isValid) {
          // alert the user to the fact that unauth data has been altered / add in roll back feature
          console.error('unauth user altered data start rollback')
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (singleToDeleteId) {
      ref.get(singleToDeleteId).put(null, (ack: Acknowledgment) => {
        if (ack.err) {
          console.error(ack.err)
          saveResponseStatus(currentUrl, 500)
          return NextResponse.json({ message: 'Failed to delete data', ok: false }, { status: 500 })
        }
      })
    }
    else {
      saveResponseStatus(currentUrl, 500)
      return NextResponse.json({ message: 'Single not found', ok: false }, { status: 500 })
    }

    saveResponseStatus(currentUrl, 201)
    return NextResponse.json({ message: 'Data Deleted', ok: true }, { status: 201 })
  }

  catch (error) {
    console.error(error)
    saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error }, { status: 500 })
  }
}