/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken"
import authApiRequest from "@/apiRequests/auth"
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import slugify from 'slugify'
import { TokenPayload } from "@/types/jwt.types"
import guestApiRequest from "@/apiRequests/guest"

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

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) localStorage.removeItem('accessToken')
  if (isBrowser) localStorage.removeItem('refreshToken')
}

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
        const decodedAccessToken = decodeToken(accessToken)
        const decodedRefreshToken = decodeToken(refreshToken)
        const now = (new Date().getTime() / 1000) -1  // Current time in seconds
        if(decodedRefreshToken.exp <= now) {
          removeTokensFromLocalStorage()
          if (param?.onError) {
            param.onError();
          }
          return
        }
        if(decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat)/3 ) {
            try {
                const role = decodedRefreshToken.role
                const res = role === Role.Guest ? await guestApiRequest.refreshToken() : (await authApiRequest.refreshToken())
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

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const generateSlugUrl = ({ name, id }: { name: string; id: number }) => {
  return `${slugify(name)}-i.${id}`
}

export const getIdFromSlugUrl = (slug: string) => {
  return Number(slug.split('-i.')[1])
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}