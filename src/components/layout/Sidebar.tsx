'use client'
import React from "react"
import { menuItems } from "@/contants"
import ActiveLink from "../common/ActiveLink"
import { IMenuItem } from "@/app/types/index.d"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "../common/ModeToggle"

export default function Sidebar(){
    return(
        <div className="p-5 border-r border-r-gray-200 bg-white w-72 flex flex-col dark:bg-gray-900 dark:text-gray-200 ">
            <div className="font-bold text-3xl inline-block mb-10">Ucademy</div> 
            <ul className="flex flex-col gap-2">
               {menuItems.map((menuItem,index)=>(
                <MenuItem key={index} title={menuItem.title} url={menuItem.url} icon={menuItem.icon}/>
               ))}
            </ul>
            <div className="flex items-center justify-start mt-auto gap-5 ">
            <UserButton/>
            <ModeToggle/>
            </div>
        </div>
    )
}
function MenuItem({ 
    url="/",
    title= "",
    icon
}:IMenuItem){
    return(
    <li>
        <ActiveLink url={url}>{icon} {title}</ActiveLink>
    </li>
    )
}