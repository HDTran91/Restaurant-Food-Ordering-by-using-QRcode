/* eslint-disable @typescript-eslint/no-unused-vars */
import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const refreshToken = cookieStore.get('refreshToken')?.value
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    if(!accessToken || !refreshToken) {
        return Response.json({
            message: "No tokens found.",
        },{
            status: 200
        })
    }
    try {
        const result = await authApiRequest.sLogout({
            accessToken,
            refreshToken
        })
        console.log("result", result)
        return Response.json(result.payload)
    }
    catch (error) {
        console.log(error)
        return Response.json({
            message: "An unexpected error occurred during logout.",
        },{
            status: 200
        })
    }
}