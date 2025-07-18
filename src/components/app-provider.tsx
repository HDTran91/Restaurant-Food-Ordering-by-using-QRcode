'use client'
import RefreshToken from '@/components/refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import {

  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        },
    }
})

const AppContext = createContext({
    role: undefined as RoleType | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setRole: (role: RoleType | undefined) => {},

})

export const useAppContext = () => {
    return useContext(AppContext)
}
export default function AppProvider({children}: {
    children: React.ReactNode
}) {
    const [role, setRoleState] = useState<RoleType | undefined>()
    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if(accessToken) {
            const role = decodeToken(accessToken).role
            setRoleState(role)
        }
    }, [])
    const setRole = useCallback((role: RoleType | undefined) => {

        setRoleState(role)
        if(!role){
            removeTokensFromLocalStorage()
        }
    },[])
    return (
        <AppContext.Provider value={{role, setRole}}>
            <QueryClientProvider client={queryClient}>
            {children}
            <RefreshToken />
            <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext.Provider>
    )
}