/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse, NextRequest } from 'next/server'

const managePaths = ['manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
      const url = new URL('/login', request.url)
      url.searchParams.set('clearToken', 'true')
      return NextResponse.redirect(url)
    }

    if (refreshToken) {
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
      // not right role, redirect to home page
      const role = decodeToken(refreshToken).role

      //guest but try to access manage paths
      const isGuestGotoManage = role === Role.Guest && managePaths.some(path => pathname.startsWith(path))

      // not guest but try to access guest paths
      const isNotGuestGotoGuest = role !== Role.Guest && guestPaths.some(path => pathname.startsWith(path))
      if (isNotGuestGotoGuest || isGuestGotoManage) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return NextResponse.next()
    }
}

export const config = {
  matcher: ['/manage/:path*','/guest/:path*','/login']
}