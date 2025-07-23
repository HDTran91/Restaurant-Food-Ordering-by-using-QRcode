/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDishListQuery } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import Quantity from '@/app/guest/menu/quantity'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { use, useMemo, useState } from 'react'
import { format } from 'path'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { useRouter } from 'next/navigation'
import { DishStatus } from '@/constants/type'

export default function MenuOrder() {
    const {data} = useDishListQuery()
    const dishes = useMemo(() => data?.payload.data ?? [], [data])
    const [order, setOrder] = useState<GuestCreateOrdersBodyType>([])
    const {mutateAsync} = useGuestOrderMutation()
    const route = useRouter()
    const totalPrice = useMemo(() => {
        return dishes.reduce((total, dish) => {
            const orderItem = order.find(item => item.dishId === dish.id)
            if (orderItem) {
                return total + (dish.price * orderItem.quantity)
            }
            return total
        }, 0)
    }, [dishes, order])

    const handleQuantityChange = (dishId: number, quantity: number) => {
        setOrder((prevOrder) => {
            if (quantity === 0) {
                return prevOrder.filter(item => item.dishId !== dishId)
            }
            const index = prevOrder.findIndex(order => order.dishId === dishId)
            if (index == -1) {
                return [...prevOrder, { dishId, quantity }]
            } else {
                const newOrder = [...prevOrder]
                newOrder[index] = {...newOrder[index], quantity }
                return newOrder

            }
        })
    }
 const handleOrder = async() => {
    try {
        const result = await mutateAsync(order)
        route.push('/guest/orders')
    }
    catch(error) {
        handleErrorApi({ error })
    }
 }
  return (
    <>
     {dishes
     .filter((dish) => dish.status !== DishStatus.Hidden)
     .map((dish) => (
        <div key={dish.id} className={cn('flex gap-4', { 'pointer-events-none': dish.status === DishStatus.Unavailable })}>
          <div className='flex-shrink-0 relative'>
            <span className ='absolute inset-0 flex items-center justify-center text-sm'>
                {dish.status === DishStatus.Unavailable && <span>Out of Order</span>}
            </span>
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className='object-cover w-[80px] h-[80px] rounded-md'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{dish.name}</h3>
            <p className='text-xs'>{dish.description}</p>
            <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
          </div>
          <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Quantity
              onChange={(value) => {
                handleQuantityChange(dish.id, value)
              }}
              value={order.find(item => item.dishId === dish.id)?.quantity ?? 0}
            />
          </div>
        </div>
      ))}
      <div className='sticky bottom-0'>
        <Button className='w-full justify-between' onClick={handleOrder} disabled={order.length === 0}>
          <span>Giỏ hàng · {order.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
