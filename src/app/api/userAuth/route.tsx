import { Acknowledgment, EncryptedItem, Item, User } from '@/types'
import { cleanResponse, generateRowId, authorisationMiddleWare, generateSigniture, encryptData, decryptData, verifySigniture, saveResponseStatus } from '@/utils'
import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// get all rows route
export const GET = async (req: Request, { params }: { params: { modelId: string } }) => {

  const currentUrl = req.url
  
  try {
    const authHeader = await req.headers.get('Authorization')

    // verify token
    const checkToken = await authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const ref = gun.get('users')
    const results: Item[] = []

    ref.map().once((res: EncryptedItem) => {
      if (res && res.encryptedData && res.signiture) {
        const decryptedData = decryptData(res.encryptedData)
        const isValid = verifySigniture(decryptedData, res.signiture)

        // if the signiture is valid it means the data has not been tampered with outside of the api
        if (isValid) {
          results.push(decryptedData)
        }
        else {
          // alert the user to the fact that unauth data has been altered / add in roll back feature
          console.error('unauth user altered data start rollback')
        }
      }
    })

    // this is my temp solution to this issue
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (results.length === 0) {
      saveResponseStatus(currentUrl, 404)
      return NextResponse.json({ message: 'No users found', ok: true, }, { status: 404 })
    }

    saveResponseStatus(currentUrl, 200)
    return NextResponse.json({ message: 'Got all users successfully', ok: true, body: cleanResponse(results) }, { status: 200 })
  }
  catch (error) {
    console.error(error)
    saveResponseStatus(currentUrl, 500)
    return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
  }


}
