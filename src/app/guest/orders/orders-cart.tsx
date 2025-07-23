/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import React, { useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import socket from '@/lib/socket'
import { UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations/order.schema'



export default function OrdersCart() {
  const {data, refetch} = useGuestGetOrderListQuery()
  const orders = useMemo(() => data?.payload.data ?? [], [data])
  console.log('orders', orders)

  const totalPrice = useMemo(() => {
          return orders.reduce((total, order) => {
              return total + order.dishSnapshot.price * order.quantity
          }, 0)
      }, [orders])
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('Socket connected', socket.id);
    }

    function onDisconnect() {
      console.log('Disconnected from socket server');
    }

    function onUpdatedOrders(data: UpdateOrderResType['data']) {
      refetch()
    }

    socket.on("update-orders", onUpdatedOrders)

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-orders", onUpdatedOrders);
    };
  }, []);
  return (
    <>
    {orders.map((order) => (
        <div key={order.id} className='flex gap-4'>
                  <div className='flex-shrink-0 relative'>
                    <Image
                      src={order.dishSnapshot.image}
                      alt={order.dishSnapshot.name}
                      height={100}
                      width={100}
                      quality={100}
                      className='object-cover w-[80px] h-[80px] rounded-md'
                    />
                  </div>
                  <div className='space-y-1'>
                    <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
                    <p className='text-xs font-semibold'>{formatCurrency(order.dishSnapshot.price)}</p>
                  </div>
                  <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                    <Badge className='text-xs'>x {order.quantity}</Badge>
                  </div>

                  <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                    <Badge variant={'outline'}>{getVietnameseOrderStatus(order.status)}</Badge>
                  </div>
          </div>

    ))}
    <div className='sticky bottom-0 '>
        <div className='w-full flex space-x-4 justify-between text-xl font-semibold'>
          <span>Total Price · {orders.length} món  </span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>

  )
}
