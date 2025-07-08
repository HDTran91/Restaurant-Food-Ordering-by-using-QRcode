/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/lib/utils'




const UNAUTHENTICATED_PATHS = ['/login', '/register', '/forgot-password','/refresh-token']
export default function RefreshToken() {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(()=> {
    console.log("localStorage", localStorage.getItem('refreshToken'))
    if(UNAUTHENTICATED_PATHS.includes(pathname)) {
      // If the user is on an unauthenticated path, we don't need to refresh the token
      return
    }
    let interval: any = null

    checkAndRefreshToken({
        onError: () => {
            clearInterval(interval)
        }
    })
    const TIMEOUT= 1000
    interval = setInterval(() => checkAndRefreshToken({
        onError: () => {
            clearInterval(interval)
            router.push('/login')
        }
    }),TIMEOUT)
    return () => {
      clearInterval(interval)}
    },[pathname, router])
  return null
}
