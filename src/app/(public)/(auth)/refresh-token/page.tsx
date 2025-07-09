/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Suspense } from 'react'

function RefreshToken() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const redirectPathName = searchParams.get('redirect')
    const ref = useRef<any>(null)
    useEffect(() => {
        if(refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
            checkAndRefreshToken({
                onSuccess: () => {
                    router.push(redirectPathName || '/')
                },

            })
        } else {
            // If the refresh token from the URL does not match the one in local storage, redirect to login
            router.push('/')
        }


    },[router, refreshTokenFromUrl, redirectPathName])
    return <div>Refresh Token</div>
}


export default function RefreshTokenPage() {
    return(
    <Suspense fallback={<div>Loading...</div>}>
        <RefreshToken />
    </Suspense>
    )
}
