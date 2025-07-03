/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'


export default function RefreshTokenPage() {
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
        }

    },[router, refreshTokenFromUrl, redirectPathName])
    return <div>Refresh Token</div>
}
