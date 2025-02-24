import { NextRequest, NextResponse } from 'next/server'
import Gun from 'gun'
import { encryptData, generateSigniture, validateEmail, validatePassword } from '@/utils'
const jwt = require('jsonwebtoken')


const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL])

// register 
export const POST = async (req: NextRequest) => {
	try {
		const { email, password } = await req.json() as User

		if (!email || !password) {
			return NextResponse.json({ message: 'Invalid params', ok: false }, { status: 400 })
		}

		// validate email / password
		const validEmail = validateEmail(email)
		const validPassword = validatePassword(password)

		if (!validEmail) {
			return NextResponse.json({ message: 'Invalid email', ok: false }, { status: 400 })
		}

		if (!validPassword) {
			return NextResponse.json({ message: 'Invalid password', ok: false }, { status: 400 })
		}

		const body = { email, password }

		// generate an data integrity signiture / encrypt data
		const signiture = generateSigniture(body)
		const encryptedData = encryptData(body)

		const newData = {
			encryptedData,
			signiture,
		}

		const ref = gun.get(email)

		let isEmailUnique: undefined | boolean

		// check that the email is unqique
		ref.once((res: EncryptedItem) => {
			if (!res) {
				isEmailUnique = true
			}
		})

		await new Promise(resolve => setTimeout(resolve, 1000))

		if (!isEmailUnique) {
			return NextResponse.json({ message: 'Email is not unique', ok: false }, { status: 500 })
		}

		ref.set(newData, (ack: Acknowledgment) => {
			if (ack.err) {
				console.error(ack.err)
				return NextResponse.json({ message: 'Failed to register user', ok: false }, { status: 500 })
			}
		})

		return NextResponse.json({ message: 'User created', token: jwt.sign({ email, password }, process.env.PUBLIC_API_TOKEN), ok: true }, { status: 201 })
	}
	catch (error) {
		console.error(error)
	}
}