"use client";
import React from "react";
import { menuItems } from "@/contants";
import ActiveLink from "../common/ActiveLink";
import { IMenuItem } from "@/app/types/index.d";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../common/ModeToggle";
import Link from "next/link";
import IconUser from "./icons/IconUse";
import ISideBar from "./ISideBar";

// const { userId } = useAuth();
export default function Sidebar() {
  
  return (
    <div className="p-5 border-r border-r-gray-200 bg-white w-72 flex-col dark:bg-gray-900 dark:text-gray-200 fixed top-0 bottom-0 lg:flex hidden  ">
      <div className="font-bold text-3xl lg:inline-block mb-10 hidden">
        Ucademy
      </div>
      <ul className="flex flex-col gap-2">
        {menuItems.map((menuItem, index) => (
          <MenuItem
            key={index}
            title={menuItem.title}
            url={menuItem.url}
            icon={menuItem.icon}
          />
        ))}
      </ul>
      <DarkMode/>
    </div>
  );
}
export function MenuItem({ url = "/", title = "", icon, onlyIcon }: IMenuItem) {
  return (
    <li>
      <ActiveLink url={url}>
        {icon} {onlyIcon?null:title}
      </ActiveLink>
    </li>
  );
}
export function DarkMode(){
  const userId = useAuth();
  return(
    <div className="lg:flex lg:items-center lg:justify-start lg:mt-auto lg:gap-5 fixed bottom-0 right-0 flex items-center gap-6 p-3 z-50">
        {!userId ? (
          <Link href="/sign-in">
            <IconUser />
          </Link>
        ) : (
          <UserButton />
        )}
        <ModeToggle />
      </div>
  )
}
