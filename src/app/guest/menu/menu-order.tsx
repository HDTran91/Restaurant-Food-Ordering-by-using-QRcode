/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDishListQuery } from '@/queries/useDish'
import { formatCurrency } from '@/lib/utils'
import Quantity from '@/app/guest/menu/quantity'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { use, useMemo, useState } from 'react'
import { format } from 'path'

export default function MenuOrder() {
    const {data} = useDishListQuery()
    const dishes = useMemo(() => data?.payload.data ?? [], [data])
    const [order, setOrder] = useState<GuestCreateOrdersBodyType>([])
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
    console.log('order', order)
  return (
    <>
     {dishes.map((dish) => (
        <div key={dish.id} className='flex gap-4'>
          <div className='flex-shrink-0'>
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
        <Button className='w-full justify-between'>
          <span>Giỏ hàng · {order.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
