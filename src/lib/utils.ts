/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken"
import authApiRequest from "@/apiRequests/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({
  error,
  setError,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(
      error?.payload?.message || "An unexpected error occurred.")
  }
}

export const normalizePath = (path: string) => {
  if (path.startsWith("/")) {
    return path.slice(1);
  }
  return path;
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('accessToken') : null

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('refreshToken') : null

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem('accessToken', value)

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem('refreshToken', value)

export const checkAndRefreshToken = async (param?:{
      onError?: () => void
      onSuccess?: () => void
}) => {

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
                if (param?.onSuccess) {
                    param.onSuccess();
                }
            }

            catch (error) {
                if (param?.onError) {
                    param.onError();
                }
            }
        }
}