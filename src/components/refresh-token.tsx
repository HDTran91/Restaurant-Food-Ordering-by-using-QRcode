/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/lib/utils'
import authApiRequest from '@/apiRequests/auth'
import { clear } from 'console'



const UNAUTHENTICATED_PATHS = ['/login', '/register', '/forgot-password','/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  useEffect(()=> {
    console.log("localStorage", localStorage.getItem('refreshToken'))
    if(UNAUTHENTICATED_PATHS.includes(pathname)) {
      // If the user is on an unauthenticated path, we don't need to refresh the token
      return
    }
    let interval: any = null
    const checkAndRefreshToken = async () => {

        const accessToken = getAccessTokenFromLocalStorage()
        const refreshToken = getRefreshTokenFromLocalStorage()
        if(!accessToken || !refreshToken) {
          // If either token is missing, we don't need to refresh
          return
        }
        const decodedAccessToken = jwt.decode(accessToken) as {exp: number, iat: number}
        const decodedRefreshToken = jwt.decode(refreshToken) as {exp: number, iat: number}
        const now = Math.round(new Date().getTime() / 1000) // Current time in seconds
        if(decodedRefreshToken.exp <= now) return
        if(decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat)/3 ) {
            try {
                const res= await authApiRequest.refreshToken()
                setAccessTokenToLocalStorage(res.payload.data.accessToken)
                setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
            }
            catch (error) {
                clearInterval(interval)
            }
        }
        }
    checkAndRefreshToken()
    const TIMEOUT= 1000
    interval = setInterval(checkAndRefreshToken,TIMEOUT)
    return () => {
      clearInterval(interval)}
    },[pathname])
  return null
}
