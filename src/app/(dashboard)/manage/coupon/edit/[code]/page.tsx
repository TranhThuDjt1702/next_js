
import Heading from '@/components/common/Heading'
import React from 'react'
import CouponEditForm from './CouponEditForm'
import { getAllCoursesInDB } from '@/lib/actions/course.actions'
import { getCouponByCode } from '@/lib/actions/coupon.action'

const page = async ({
    params
}:{
    params: {
        code: string
    } 
}) => {
    const param = await params;
    const courseList = await getAllCoursesInDB() || []
    const coupon = await getCouponByCode({code: param.code})
    console.log(coupon)
  return (
    <div>
     <Heading>Coupon Edit</Heading>
    {coupon && <CouponEditForm coupon={coupon} param={param} courseList={courseList} />}
    </div>
  )
}

export default page
