import http from '@/lib/http'
import { AccountResType, ChangePasswordBodyType, CreateEmployeeAccountBodyType, UpdateMeBodyType } from '@/schemaValidations/account.schema'


const accountApiRequest = {
    me: () => http.get<AccountResType>('/accounts/me'),
    sMe:(accessToken: string) =>http.get<AccountResType>('/accounts/me', {
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),
    changePassword:(body: ChangePasswordBodyType) => http.put<AccountResType>('/accounts/change-password', body),
    list: () => http.get<AccountResType[]>('/accounts'),
    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>('/accounts', body),
    updateEmployee: (id: number, body: CreateEmployeeAccountBodyType) => http.put<AccountResType>(`/accounts/detail/${id}`, body),
    getEmployee: (id: number) => http.get<AccountResType>(`/accounts/detail/${id}`),
    deleteEmployee: (id: number) => http.delete(`/accounts/detail/${id}`),
}

export default accountApiRequest