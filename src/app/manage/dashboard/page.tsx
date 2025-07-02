import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function DashBoard() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value as string

  try {
    const result = await accountApiRequest.sMe(accessToken)
    const name = result.payload.data.name

    return <div>DashBoard {name}</div>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any

     // Redirect to logout, preserving refresh token in query if needed
    const refreshToken = cookieStore.get('refreshToken')?.value
    if (refreshToken) {
      redirect(`/logout?refreshToken=${refreshToken}`)
    } else {
      redirect('/logout')
    }
  }
}
