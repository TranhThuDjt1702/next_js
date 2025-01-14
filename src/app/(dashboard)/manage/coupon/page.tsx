import Heading from '@/components/common/Heading'
import { Header } from '@radix-ui/react-accordion'
import React from 'react'
import CouponManage from './CouponManage'
import { getAllCoupon, getAllCouponInDB } from '@/lib/actions/coupon.action'
import { getAllCourses, getAllCoursesInDB } from '@/lib/actions/course.actions'
import { ECouponStatus, ECouponType } from '@/contants/enums'

const page = async({
  searchParams
}:{
  searchParams: Promise<{
    page?: number;
    search?: string;
    status?: string;
    coupon_type?: string;
  }>
}) => {
  
  const params = await searchParams
  // const time = new Date()
  // console.log("time",time);
  const status = Object.values(ECouponStatus).includes(params.status as ECouponStatus) ? params.status as ECouponStatus : undefined;
  const coupon_type = Object.values(ECouponType).includes(params.coupon_type as ECouponType) ? params.coupon_type as ECouponType : undefined
  const limit = 5
  const couponsList = await getAllCoupon({
    page: params.page,
    limit: limit,
    search: params.search,
    status,
    coupon_type,
  }) || []
  const allCoupon =  await getAllCouponInDB() || []
  const limitPage = Math.ceil((allCoupon?.length ?? 0) / limit);
  const courseList = await getAllCoursesInDB() || []

  return (
    <div>
      <Heading>Coupon manage</Heading>
      <CouponManage couponsList={couponsList}  courseList={courseList} limitPage={limitPage} />
    </div>
  )
}

export default page
