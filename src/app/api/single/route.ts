import { EncryptedItem, Item } from '@/types'
import { saveResponseStatus } from '@/utils/api'
import { authorisationMiddleWare, decryptData, verifySigniture } from '@/utils/security'
import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// get all singles from db
export const GET = async (req: Request) => {

  const currentUrl = req.url

  // this optional header is used to ignore saving the api response
	const ignoreHeader = req.headers.get('Ignore')
  const authHeader = req.headers.get('Authorization')

  try {

    // verify token
    const checkToken = authorisationMiddleWare(authHeader)
    if (checkToken) return checkToken

    const ref = gun.get('single')
    let result: Item[] = []


    ref.map().once((res: EncryptedItem) => {
      if (res) {
        const decryptedData = decryptData(res.encryptedData) as Item
        const isValid = verifySigniture(decryptedData, res.signiture)

        // if the signiture is valid it means the data has not been tampered with outside of the api
        if (isValid) {
          result.push(decryptedData)
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
