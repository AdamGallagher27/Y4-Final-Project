import { Acknowledgment, StatusFromAPI } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import Gun from 'gun'
import peers from '../../../../public/peers.json'
import { cleanResponse } from '@/utils'

const gun = Gun([process.env.NEXT_PUBLIC_GUN_URL, ...peers])

export const POST = async (req: NextRequest,) => {
	try {
		const body = await req.json() as StatusFromAPI

		const newStatus = {
			...body,
			createdAt: new Date().toLocaleString()
		}

		const ref = gun.get('StatusFromAPIDB')

		ref.set(newStatus, (ack: Acknowledgment) => {
			if (ack.err) {
				console.error(ack.err)
				return NextResponse.json({ message: 'Failed to save data', ok: false }, { status: 500 })
			}
		})

		return NextResponse.json({ message: 'Saved API response status', ok: true }, { status: 201 })
	}
	catch (error) {
		console.error(error)
	}
}


export const GET = async (req: Request) => {
	try {
		const ref = gun.get('StatusFromAPIDB')
		const results: StatusFromAPI[] = []

		ref.map().once((res: StatusFromAPI) => {
			if (res) {
				results.push(res)
			}
		})

		await new Promise(resolve => setTimeout(resolve, 1000))

		return NextResponse.json({ message: 'Got status successfully', body: cleanResponse(results), ok: true }, { status: 201 })
	}
	catch (error) {
		return NextResponse.json({ error: error, ok: false }, { status: 500 })
	}
}