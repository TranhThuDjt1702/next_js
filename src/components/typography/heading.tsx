'use client'
import React from 'react'

const Heading = ({children}:{
    children: React.ReactNode
}) => {
  return (
    <div className='text-3xl font-bold'>
      {children}
    </div>
  )
}

export default Heading
