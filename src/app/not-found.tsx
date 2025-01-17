import Link from 'next/link'
import React from 'react'


const Notfound = () => {
    return (
        <div className='flex flex-col justify-center items-center h-screen '>
            <h1 className='font-bold'>404</h1>
            <h2>Page not found</h2>
            <Link href='/' className='text-2xl cursor-pointer hover:text-purple-400 flex items-center gap-5' >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>

                Back to homescreen</Link>
        </div>
    )
}

export default Notfound
