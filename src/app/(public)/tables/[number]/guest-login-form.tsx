'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { handleErrorApi } from '@/lib/utils'
import { useAppContext } from '@/components/app-provider'
import { useGuestLoginMutation } from '@/queries/useGuest'

export default function GuestLoginForm() {
  const {setRole} = useAppContext()
  const searchParams = useSearchParams()
  const params = useParams()
  const tableNumber = Number(params.number)
  const token = searchParams.get('token')!
  const loginMutation = useGuestLoginMutation()
  const router = useRouter()
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber
    }
  })

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [token, router])

  async function onSubmit(values: GuestLoginBodyType) {
    if(loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(values)
      setRole(result.payload.data.guest.role)
      router.push(`/guest/menu`)
    } catch (error) {
      handleErrorApi({error})
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
