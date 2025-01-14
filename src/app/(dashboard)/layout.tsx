import IconUser from "@/components/layout/icons/IconUse";
import Sidebar, { DarkMode, MenuItem } from "@/components/layout/Sidebar";
import { menuItems } from "@/contants";
import { useAuth } from "@clerk/nextjs";
import React from "react";

const page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-gray-100 h-screen w-full">
      <Sidebar />
      <DarkMode/>
      <ul className=" dark:text-white dark:bg-black p-3 w-full justify-center items-center gap-2 flex lg:hidden flex-row fixed bottom-0 z-40 bg-white">
        {menuItems.map((menuItem, index) => (
          <MenuItem
            key={index}
            title={menuItem.title}
            url={menuItem.url}
            icon={menuItem.icon}
            onlyIcon
          />
        ))}
      </ul>

      <main className="p-4 w-full dark:bg-black dark:text-gray-200 lg:pl-72 h-full ">
        {children}
      </main>
    </div>
  );
};

export default page;
