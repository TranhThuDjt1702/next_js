import Sidebar from '@/components/layout/Sidebar'
import React from 'react'


const page = ({
    children
}:{children:React.ReactNode}) => {
  return (
    <div className='flex bg-gray-100 h-screen w-full' >
        <Sidebar/>
        <main className='p-4 w-full dark:bg-black dark:text-gray-200'>{children}</main>
    </div>
  )
}

export default page
