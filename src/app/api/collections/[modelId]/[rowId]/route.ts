import { Acknowledgment, DecryptedData, EncryptedItem, Item } from '@/types'
import { cleanResponse, getGunEntryId } from '@/utils'
import { saveResponseStatus } from '@/utils/api'
import { authorisationMiddleWare, decryptData, verifySigniture, encryptData, generateSigniture } from '@/utils/security'
import Gun from 'gun'
import { NextResponse } from 'next/server'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// get single row from collection
export const GET = async (req: Request, { params }: { params: { modelId: string, rowId: string } }) => {

	const currentUrl = req.url

	// this optional header is used to ignore saving the api response
	const ignoreHeader = req.headers.get('Ignore')
	const authHeader = req.headers.get('Authorization')

	try {
		// verify token
		const checkToken = authorisationMiddleWare(authHeader)
		if (checkToken) return checkToken

		const { modelId, rowId } = params

		const ref = gun.get(modelId)
		const results: Item[] = []

		ref.map().once((res: EncryptedItem) => {
			if (res && res.id === rowId) {
				const decryptedData: DecryptedData = decryptData(res.encryptedData)
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

		!ignoreHeader && saveResponseStatus(currentUrl, 200)
		return NextResponse.json({ body: cleanResponse(results), ok: true, message: 'Retrieved single row successfully' }, { status: 200 })
	}
	catch (error) {
		console.error(error)
		!ignoreHeader && saveResponseStatus(currentUrl, 500)
		return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
	}
}

// update row
export const PUT = async (req: Request, { params }: { params: { modelId: string, rowId: string } }) => {

	const currentUrl = req.url
	// this optional header is used to ignore saving the api response
	const ignoreHeader = req.headers.get('Ignore')
	const authHeader = req.headers.get('Authorization')

	try {

		// verify token
		const checkToken = authorisationMiddleWare(authHeader)
		if (checkToken) return checkToken

		const body = await req.json()

		// Extract modelId and rowId from the params
		const { modelId, rowId } = await params
		const ref = gun.get(modelId)

		if (!body || !modelId) {
			!ignoreHeader && saveResponseStatus(currentUrl, 400)
			return NextResponse.json({ message: 'invalid params', ok: false }, { status: 400 })
		}

		const results: DecryptedData = {}

		ref.map().once((res: EncryptedItem) => {
			if (res) {
				const decryptedData = decryptData(res.encryptedData)
				const isValid = verifySigniture(decryptedData, res.signiture)

				// if the current entry is valid and the id matches the row id param
				// create a new body and add it as a property to results
				if (isValid && res.id === rowId) {

					const combinedBody = { ...decryptedData, ...body } as Item

					const newBody = {
						id: rowId,
						encryptedData: encryptData(combinedBody),
						signiture: generateSigniture(combinedBody),
					}

					results[getGunEntryId(res)] = newBody
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

		// Gun needs to wait a second for GET to work
		// this doesnt work because its scoped to inside set time out
		// setTimeout(() => {
		//   return NextResponse.json(results)
		// }, 1000)

		// this is my temp solution to this issue
		await new Promise(resolve => setTimeout(resolve, 1000))

		// currently unable to update one row so I have to update every row at once\
		// NOTE TO SELF: not sure if this effects performance, would rather a better solution
		// but if it doesnt effect performance it should be fine 
		// also when put method goes through tmp files are made
		// this doesnt do anything and app works fine when they are deleted just need to add a clean up funciton
		ref.put(results, (ack: Acknowledgment) => {
			if (ack.err) {
				console.error(ack.err)
				!ignoreHeader && saveResponseStatus(currentUrl, 500)
				return NextResponse.json({ message: 'Failed to update data', ok: false }, { status: 500 })
			}
		})

		!ignoreHeader && saveResponseStatus(currentUrl, 200)
		return NextResponse.json({ message: 'Successfully updated row', ok: true }, { status: 200 })
	}
	catch (error) {
		console.error(error)
		!ignoreHeader && saveResponseStatus(currentUrl, 500)
		return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
	}
}


// delete row
export const DELETE = async (req: Request, { params }: { params: { modelId: string, rowId: string } }) => {

	const currentUrl = req.url
	// this optional header is used to ignore saving the api response
	const ignoreHeader = req.headers.get('Ignore')
	const authHeader = req.headers.get('Authorization')

	try {

		// verify token
		const checkToken = authorisationMiddleWare(authHeader)
		if (checkToken) return checkToken

		// Extract modelId and rowId from the params
		const { modelId, rowId } = params
		const ref = gun.get(modelId)

		let rowToDeleteId: string | undefined

		ref.map().once((res: EncryptedItem) => {
			if (res) {
				const decryptedData = decryptData(res.encryptedData)
				const isValid = verifySigniture(decryptedData, res.signiture)

				// if the current entry is valid and the id matches the row id param
				// store the row id then delete it later
				if (isValid && res.id === rowId) {
					rowToDeleteId = getGunEntryId(res)
				}
				else if (!isValid) {
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

		if (rowToDeleteId) {
			ref.get(rowToDeleteId).put(null, (ack: Acknowledgment) => {
				if (ack.err) {
					console.error(ack.err)
					!ignoreHeader && saveResponseStatus(currentUrl, 500)
					return NextResponse.json({ message: 'Failed to delete data', ok: false }, { status: 500 })
				}
			})
		}
		else {
			!ignoreHeader && saveResponseStatus(currentUrl, 500)
			return NextResponse.json({ message: 'Row not found', ok: false }, { status: 500 })
		}

		!ignoreHeader && saveResponseStatus(currentUrl, 200)
		return NextResponse.json({ message: 'Successfully deleted row', ok: true }, { status: 200 })
	}
	catch (error) {
		!ignoreHeader && saveResponseStatus(currentUrl, 500)
		return NextResponse.json({ message: 'An error occoured', ok: false, error: error }, { status: 500 })
	}


}