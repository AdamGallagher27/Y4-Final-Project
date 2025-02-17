import { authorisationMiddleWare, cleanResponse, decryptData, verifySigniture } from "@/utils"
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
// export const PUT = async (req: Request, { params }: { params: { modelId: string, rowId: string } }) => {
// 	const authHeader = await req.headers.get('Authorization')

// 	// verify token
// 	const checkToken = await authorisationMiddleWare(authHeader)
// 	if (checkToken) return checkToken

// 	const { modelId, rowId } = await params

// 	const ref = gun.get(modelId)


// 	await ref.map().once((res) => {
// 		if (res && res.id === rowId) {
// 			const decryptedData = decryptData(res.encryptedData)
// 			const isValid = verifySigniture(decryptedData, res.signiture)

// 			// if the signiture is valid it means the data has not been tampered with outside of the api
// 			if (isValid) {
				
				
// 			}
// 			else {
// 				// alert the user to the fact that unauth data has been altered / add in roll back feature
// 				console.error('unauth user altered data start rollback')
// 			}
// 		}
// 	})
// }
