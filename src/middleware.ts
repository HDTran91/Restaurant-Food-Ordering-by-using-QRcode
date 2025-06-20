/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from 'next/server'


const privatePaths = ['/manage']
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const isAuth = Boolean(request.cookies.get('accessToken')?.value)
    //not login yet, not allow to access private paths
    if (privatePaths.some(path => pathname.startsWith(path))) {
    if (!isAuth) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(new URL(url))
        }
    }
    // already login, not allow to access unAuth paths
    if (unAuthPaths.some(path => pathname.startsWith(path))) {
        if (isAuth) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(new URL(url))
        }
    }
    return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*','/login']
}