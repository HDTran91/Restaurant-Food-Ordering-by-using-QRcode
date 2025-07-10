/* eslint-disable @typescript-eslint/no-unused-vars */
import accountApiRequest from "@/apiRequests/account"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"



export const useAccountMe = () => {
    return useQuery({
        queryKey: ['account-me'],
        queryFn: accountApiRequest.me
    })
}


export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe,
    })

}

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.changePassword
    })
}

export const useGetAccountList = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: accountApiRequest.list
    })
}

export const useGetAccount = ({id, enabled}: {id: number, enabled: boolean}) => {
    return useQuery({
        queryKey: ['account', id],
        queryFn: () => accountApiRequest.getEmployee(id),
        enabled
    })
}

export const useAddAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        }
    })
}

export const useUpdateAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, password, confirmPassword, ...rest }: UpdateEmployeeAccountBodyType & { id: number }) =>
            accountApiRequest.updateEmployee(id, {
                ...rest,
                password: password ?? "",
                confirmPassword: confirmPassword ?? ""
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'],
                exact: true,
             })
        }
    })
}


export const useDeleteAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => accountApiRequest.deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] })
        }
    })
}
