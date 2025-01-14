'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'

const PayButton = ({orderDetail}:{
    orderDetail: any
}) => {
    const code =  orderDetail.code;
    console.log(code);
    const router = useRouter();
    const handlePayBtn = () => {
        router.push(`/order/${code}/payment`)
    }
  return (
    <div>
      <Button className="bg-purple-500 mt-4 w-full hover:bg-purple-400" onClick={() => handlePayBtn()}>
        Tiếp tục
        </Button>
    </div>
  )
}

export default PayButton
