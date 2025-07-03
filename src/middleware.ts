/* eslint-disable @typescript-eslint/no-unused-vars */
import { access } from 'fs'
import { NextResponse, NextRequest } from 'next/server'


const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    //not login yet, not allow to access private paths

    if (unAuthPaths.some(path => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // already login, accessToken is expired
    if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken && refreshToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken',refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)

      }
      return NextResponse.next()

}

export const config = {
  matcher: ['/manage/:path*','/login']
}