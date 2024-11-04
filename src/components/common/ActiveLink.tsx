'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { IActiveLinkProps } from '@/app/types/index.d';

const ActiveLink = ({ url, children }: IActiveLinkProps) => {
  const pathname = usePathname()
  const isActive = url === pathname
  return (
    <Link className={`p-3 rounded-md flex items-center gap-3 ${isActive ? "text-white bg-violet-800" : " hover:text-purple-950 hover:bg-purple-500 hover:bg-opacity-10 transition-all"} ${isActive ? "dark:text-white dark:bg-gray-400" : " dark:hover:text-gray-200 dark:hover:bg-gray-400 dark:hover:bg-opacity-10 dark:transition-all"}`} href={url}>{children}</Link>
  )
}

export default ActiveLink
