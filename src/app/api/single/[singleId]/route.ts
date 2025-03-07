import { Acknowledgment, EncryptedItem, Item } from '@/types'
import { authorisationMiddleWare, decryptData, encryptData, generateSigniture, getGunEntryId, saveResponseStatus, verifySigniture } from '@/utils'
import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// get selected single from db
export const GET = async (req: Request, { params }: { params: { singleId: string } }) => {

  const currentUrl = req.url

  try {
    const authHeader = await req.headers.get('Authorization')

    // verify token
    const checkToken = authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const { singleId } = await params

    const ref = gun.get('single')
    let result: Item[] = []


    ref.map().once((res: EncryptedItem) => {
      if (res) {
        const decryptedData = decryptData(res.encryptedData) as Item
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
      saveResponseStatus(currentUrl, 404)
      return NextResponse.json({ ok: false, message: 'Not found' }, { status: 404 })
    }

    saveResponseStatus(currentUrl, 200)
    return NextResponse.json({ singles: result, ok: true, message: 'Retrieved singles successfully' }, { status: 200 })
  }
  catch (error) {
    console.error(error)
    saveResponseStatus(currentUrl, 500)
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
      encryptedData,
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

    const ref = gun.get(singleId)

    ref.map().once((res: EncryptedItem) => {
      if (res) {
        const decryptedData = decryptData(res.encryptedData)
        const isValid = verifySigniture(decryptedData, res.signiture)

        // if the signiture is valid it means the data has not been tampered with outside of the api
        if (isValid) {
          // generate an data integrity signiture / encrypt data
          const signiture = generateSigniture(value)
          const encryptedData = encryptData(value)

          const newData = {
            [getGunEntryId(res)]: {
              encryptedData,
              signiture
            }
          }

          ref.put(newData, (ack: Acknowledgment) => {
            if (ack.err) {
              console.error(ack.err)
              saveResponseStatus(currentUrl, 500)
              return NextResponse.json({ message: 'Failed to save data', ok: false }, { status: 500 })
            }
          })
        }
        else {
          // alert the user to the fact that unauth data has been altered / add in roll back feature
          console.error('unauth user altered data start rollback')
        }
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

    const { value } = await req.json()

    if (value === undefined || value === null || !singleId) {
      saveResponseStatus(currentUrl, 400)
      return NextResponse.json({ message: 'invalid params', ok: false }, { status: 400 })
    }

    const ref = gun.get(singleId)

    let gunEntryId: string | undefined


    ref.map().once((res: EncryptedItem) => {
      if (res) {
        const decryptedData = decryptData(res.encryptedData)
        const isValid = verifySigniture(decryptedData, res.signiture)

        // store the gun js id then delete it later
        if (isValid) {
          gunEntryId = getGunEntryId(res)
        }
        else if (!isValid) {
          // alert the user to the fact that unauth data has been altered / add in roll back featurje
          console.error('unauth user altered data start rollback')
        }
      }
    })

    // gun needs to assign gunEntryId and this allows it 
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (gunEntryId) {
      ref.get(gunEntryId).put(null, (ack: Acknowledgment) => {
        if (ack.err) {
          console.error(ack.err)
          saveResponseStatus(currentUrl, 500)
          return NextResponse.json({ message: 'Failed to delete data', ok: false }, { status: 500 })
        }
      })
    }
    else {
      saveResponseStatus(currentUrl, 500)
      return NextResponse.json({ message: 'Data not found', ok: false }, { status: 500 })
    }

    saveResponseStatus(currentUrl, 200)
    return NextResponse.json({ message: 'Data deleted', ok: true }, { status: 200 })
  }

  catch (error) {
    console.error(error)
    saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error }, { status: 500 })
  }
}

