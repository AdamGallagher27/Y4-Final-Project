import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
	const isAuthenticated = request.cookies.get('authenticated')?.value === 'true'

	if (!isAuthenticated) {
		return NextResponse.redirect(new URL('/', request.url))
	}
  
	return NextResponse.next()
}

export const config = {
	matcher: '/pages/:path*',
}
