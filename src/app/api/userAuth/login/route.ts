import { NextRequest, NextResponse } from 'next/server'
import Gun from 'gun'
import { decryptData, saveResponseStatus, validateEmail, validatePassword, verifySigniture } from '@/utils'
import { EncryptedItem, User } from '@/types'
const jwt = require('jsonwebtoken')

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// login 
export const POST = async (req: NextRequest) => {

	const currentUrl = req.url

	try {
		const { email, password } = await req.json() as User

		if (!email || !password) {
			saveResponseStatus(currentUrl, 400)
			return NextResponse.json({ message: 'Invalid params', ok: false }, { status: 400 })
		}

		// validate email / password
		const validEmail = validateEmail(email)
		const validPassword = validatePassword(password)

		if (!validEmail) {
			saveResponseStatus(currentUrl, 400)
			return NextResponse.json({ message: 'Invalid email', ok: false }, { status: 400 })
		}

		if (!validPassword) {
			saveResponseStatus(currentUrl, 400)
			return NextResponse.json({ message: 'Invalid password', ok: false }, { status: 400 })
		}

		let correctPasword: undefined | boolean

		gun.get(email).map().once((res: EncryptedItem) => {
			if (res) {
				const decryptedUser = decryptData(res.encryptedData) as User
				const isValid = verifySigniture(decryptedUser, res.signiture)

				if (isValid && decryptedUser.password === password) {
					correctPasword = true
				}
			}
		})

		await new Promise(resolve => setTimeout(resolve, 1000))

		if (!correctPasword) {
			saveResponseStatus(currentUrl, 405)
			return NextResponse.json({ message: 'Incorrect password or email', ok: false }, { status: 405 })
		}

		saveResponseStatus(currentUrl, 201)
		return NextResponse.json({ message: 'User logged in', token: jwt.sign({ email, password }, process.env.NEXT_PUBLIC_API_TOKEN), ok: true }, { status: 201 })
	}
	catch (error) {
		console.error(error)
	}
}