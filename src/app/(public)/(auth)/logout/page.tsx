/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'


export default function LogoutPage() {
    const {mutateAsync} = useLogoutMutation()
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const ref = useRef<any>(null)
    useEffect(() => {
        if(ref.current) {
            return
        }
        ref.current = mutateAsync
        mutateAsync().then((res)=> {
            setTimeout(() => {
                ref.current = null
            }, 1000)
            router.push('/login')
            })
    },[mutateAsync, router, refreshTokenFromUrl])
    return <div>LogoutPage</div>
}
