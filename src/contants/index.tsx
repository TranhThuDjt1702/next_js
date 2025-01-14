import React from "react"
import { Iconcomment, IconExplore, IconMember, IconPlay } from "@/components/layout/icons"
import { IMenuItem } from "@/app/types/index.d"
import IconCourse from "@/components/layout/icons/IconCourse"
import IconOrder from "@/components/layout/icons/IconOrder"
import { ECouponStatus, ECouponType, EcourseStatus, EOrderStatus } from "./enums"
export const menuItems : IMenuItem[] = [
    {
        url:'/',
        title: 'khu vực khám phá',
        icon: <IconExplore className="size-5" />
    },
    {
        url:'/study',
        title: 'khu vực học tập',
        icon: <IconPlay className="size-5" />
    },
    {
        url:'/manage/course',
        title: 'quản lí khóa học',
        icon: <IconCourse className="size-5" />
    },
    {
        url:'/manage/member',
        title: 'quản lí thành viên',
        icon: <IconMember className="size-5" />
    },
    {
        url:'/manage/comment',
        title: 'quản lí bình luận',
        icon: <Iconcomment className="size-5" />
    },
    {
        url:'/manage/order',
        title: 'quản lí đơn hàng',
        icon: <IconOrder className="size-5" />
    },
    {
        url:'/manage/coupon',
        title :'quản lí mã giảm giá',
        icon : <IconOrder className="size-5" />
    }
]

export const courseStatus : {
    title: string,
    value : EcourseStatus,
    classname?: string
}[] = [
    {
        title : "Chờ duyệt",
        value : EcourseStatus.PENDING,
        classname : "font-bold text-yellow-500"
    },
    {
        title : "Đã duyệt",
        value : EcourseStatus.APPROVED,
        classname : "font-bold text-green-500"
    },
    {
        title : "Từ chối",
        value : EcourseStatus.REJECTED,
        classname : "font-bold text-red-500"
    }

]

export const orderStatus : {
    title: string,
    value : EOrderStatus,
    classname?: string  
}[] = [
    {
        title : "Chờ duyệt",
        value : EOrderStatus.PENDING,
        classname : "font-bold text-yellow-500"
    },
    {
        title : "Đã mua ",
        value : EOrderStatus.SUCCESS,
        classname : "font-bold text-green-500"
    },
    {
        title : "Chưa mua",
        value : EOrderStatus.CANCEL,
        classname : "font-bold text-red-500"
    }
]

export const couponStatus : {
    title: string,
    value : ECouponStatus,
    classname?: string
}[] = [
    {
        title : "Đang hoạt động",
        value : ECouponStatus.ACTIVE,
        classname : "font-bold text-green-500 text-xs"
    },
    {
        title : "Hết hạn",
        value : ECouponStatus.INACTIVE,
        classname : "font-bold text-red-500"
    }
]

export const couponArrayType : {
    title : string,
    value : ECouponType
}[] = [
    {
        title : "Giảm theo %",
        value : ECouponType.PERCENT
    },
    {
        title : "Giảm theo số tiền",
        value : ECouponType.AMOUNT
    }
]

export const commonCourseClass = {
    action : "size-8 rounded-full flex item-center justify-center p-2 text-gray-500 hover:text-gray-800 dark:bg-gray-800 dark:text-opacity-80 dark:bg-tranparent  dark:hover:text-white hover:bg-purple-500 hover:text-white ",
}