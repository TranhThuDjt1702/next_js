'use server'
import React from 'react'
import OrderList from './OrderList'
import { getAllOrder } from '@/lib/actions/order.action';
import { EOrderStatus } from '@/contants/enums';

const page = async ({searchParams} : {
  searchParams: Promise<{
    page?: number;
    search?: string;
    status?: string;
  }>
}) => {
  const params = await searchParams;
  const limit = 5;
  const status = Object.values(EOrderStatus).includes(params.status as EOrderStatus) ? params.status as EOrderStatus : undefined;
  const page = params.page || 1;
  const orderList = await getAllOrder({
    page,
    limit : limit,
    search: params.search || "",
    status,
  })  
  const orderInDb = await getAllOrder({})
  const limitPage = Math.ceil((orderInDb?.length ?? 0) / limit);
  
  return (
  <>
    <OrderList orderList={orderList} limitPage={limitPage} />
  </>
  )
}

export default page
