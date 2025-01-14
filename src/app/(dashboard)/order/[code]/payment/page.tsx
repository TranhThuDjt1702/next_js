import Heading from '@/components/common/Heading'
import React from 'react'
import PaymentManage from './PaymentManage'
import { getOrderDetail } from '@/lib/actions/order.action'
import { addCourseToUser, getAllUser } from '@/lib/actions/user.actions'
import { getAllCouponInDB } from '@/lib/actions/coupon.action'
import { add } from 'lodash'

const page = async ({params}:{
  params :{
    code :string
  }
}) => {
  const order = await getOrderDetail(params.code)
  const user = await getAllUser()
  // console.log("user: ", user);
  const userInfo = user[0];
  const allCoupon = await getAllCouponInDB() || [];
  console.log("order: ", order);
  await addCourseToUser({courseId: order.course._id})
  return (
    <div>
      <Heading>Payment page</Heading>
      <PaymentManage order={order} userInfo={userInfo} allCoupon = {allCoupon} />
    </div>
  )
}

export default page
