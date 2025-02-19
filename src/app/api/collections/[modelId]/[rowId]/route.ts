import { authorisationMiddleWare, cleanResponse, decryptData, encryptData, generateSigniture, getGunEntryId, verifySigniture } from '@/utils'
import Gun from "gun"
import { NextResponse } from "next/server"

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// get single row from collection
export const GET = async (req: Request, { params }: { params: { modelId: string, rowId: string } }) => {
	const authHeader = await req.headers.get('Authorization')

	// verify token
	const checkToken = await authorisationMiddleWare(authHeader)
	if (checkToken) return checkToken

	const { modelId, rowId } = await params

	const ref = gun.get(modelId)
	const results: Item[] = []

	await ref.map().once((res) => {
		if (res && res.id === rowId) {
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

	return NextResponse.json(cleanResponse(results))
}

// update row
export const PUT = async (req: Request, { params }: { params: { modelId: string, rowId: string } }) => {
	const authHeader = await req.headers.get('Authorization')

	// verify token
	const checkToken = await authorisationMiddleWare(authHeader)
	if (checkToken) return checkToken

	const body = await req.json()

	// Extract modelId and rowId from the params
	const { modelId, rowId } = await params
	const ref = gun.get(modelId)

	// fix any later
	const results: any = {}
	
	await ref.map().once((res) => {
		if (res && res.encryptedData) {
			const decryptedData = decryptData(res.encryptedData)
			const isValid = verifySigniture(decryptedData, res.signiture)

			// if the current entry is valid and the id matches the row id param
			// create a new body and add it as a property to results
			if (isValid && res.id === rowId) {

				const combinedBody = { ...decryptedData, ...body }

				const newBody = {
					id: rowId,
					encryptedData: encryptData(combinedBody),
					signiture: generateSigniture(combinedBody),
				}

				results[getGunEntryId(res)] = newBody
			}

			// if the entry is valid but does not match 
			// dont edit it and add it to results
			else if(isValid) {
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
	ref.put(results, (ack: Acknowledgment) => console.log(ack))

	return NextResponse.json({message: 'updated successfully'})
}
