import React from "react"
import { Iconcomment, IconExplore, IconMember, IconPlay } from "@/components/layout/icons"
import { IMenuItem } from "@/app/types/index.d"
import IconCourse from "@/components/layout/icons/IconCourse"
import IconOrder from "@/components/layout/icons/IconOrder"
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
]