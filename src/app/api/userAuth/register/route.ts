import { NextRequest, NextResponse } from 'next/server'
import Gun from 'gun'
import { Acknowledgment, EncryptedItem, User } from '@/types'
import { validateEmail, validatePassword } from '@/utils'
import { saveResponseStatus } from '@/utils/api'
import { generateSigniture, encryptData, decryptData, verifySigniture } from '@/utils/security'
const jwt = require('jsonwebtoken')
import peers from '../../../../../public/peers.json'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL, ...peers])
// register 
export const POST = async (req: NextRequest) => {

	const currentUrl = process.env.NEXT_PUBLIC_HOSTING_URL || 'http://localhost:3000/'

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

		const body = { email, password }

		// generate an data integrity signiture / encrypt data
		const signiture = generateSigniture(body)
		const encryptedData = encryptData(body)

		const newData = {
			...encryptedData,
			signiture,
		}

		const ref = gun.get('usersDB')

		let isEmailUnique: boolean = true

		// check that the email is unqique
		ref.map().once((res: EncryptedItem) => {
			if (res) {
				const decryptedData = decryptData(res)
				const isValid = verifySigniture(decryptedData, res.signiture)

				if (isValid && decryptedData.email === email) {
					isEmailUnique = false
				}
			}
		})

		await new Promise(resolve => setTimeout(resolve, 1000))

		if (!isEmailUnique) {
			saveResponseStatus(currentUrl, 500)
			return NextResponse.json({ message: 'Email is not unique', ok: false }, { status: 500 })
		}

		ref.set(newData, (ack: Acknowledgment) => {
			if (ack.err) {
				console.error(ack.err)
				saveResponseStatus(currentUrl, 500)
				return NextResponse.json({ message: 'Failed to register user', ok: false }, { status: 500 })
			}
		})

		saveResponseStatus(currentUrl, 201)
		return NextResponse.json({ message: 'User created', token: jwt.sign({ email, password }, process.env.NEXT_PUBLIC_API_TOKEN), ok: true }, { status: 201 })
	}
	catch (error) {
		console.error(error)
	}
}