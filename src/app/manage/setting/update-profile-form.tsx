/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccountMe, useUpdateMeMutation } from '@/queries/useAccount'
import { UploadMediaMutation } from '@/queries/useMedia'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'


export default function UpdateProfileForm() {
  const route = useRouter()
  const [ file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const updateMeMutation = useUpdateMeMutation()
  const uploadMediaMutation = UploadMediaMutation()
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  })
  const {data} = useAccountMe()
  const avatar = form.watch('avatar')
  useEffect(() => {
    if(data){
      const {name, avatar} = data.payload.data
      form.reset({
        name,
        avatar: avatar ?? undefined
      })
    }

  },[form, data])
  const previewAvatar = useMemo(() => {
    if(file) {
      return URL.createObjectURL(file)
    }
    return avatar
  },[avatar ,file])

  const name = form.watch('name')

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const submit = async (values: UpdateMeBodyType) => {
    if(updateMeMutation.isPending) return
    try {
      let body = values
      if(file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageRedult = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageRedult.payload.data
        body= {
          ...values,
          avatar: imageUrl
        }
        const result = await updateMeMutation.mutateAsync(body)
        toast.success(result.payload.message)
        route.refresh()
      }
    }
    catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
  }
}
  return (
    <Form {...form}>
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8'
      onReset={reset}
      onSubmit= {form.handleSubmit(submit)}
      >
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                      </Avatar>
                      <input type='file' accept='image/*' className='hidden' ref= {avatarInputRef}
                        onChange = {(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:3000/media/' + file.name) // Adjust this URL based on your media upload endpoint
                          }
                        }}
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick = {() => avatarInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Tên</Label>
                      <Input id='name' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  cancel
                </Button>
                <Button size='sm' type='submit'>
                  save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
