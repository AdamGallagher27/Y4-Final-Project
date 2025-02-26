import { StatusFromAPI } from '@/types'
import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'


export const POST = async (req: NextRequest,) => {
	try {
		const { url, status } = await req.json() as StatusFromAPI

		const filePath = path.join(process.cwd(), 'public', 'response.json')

		if (!status || !url) {
			return NextResponse.json({ message: 'Invalid url or status params', ok: false }, { status: 500 })
		}

		const currentResponses = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

		fs.writeFileSync(filePath, JSON.stringify([...currentResponses, { url, status, createdAt: new Date().toLocaleString() }]))

		return NextResponse.json({ message: 'Saved API response status', ok: true }, { status: 201 })
	}
	catch (error) {
		console.error(error)
	}
}
