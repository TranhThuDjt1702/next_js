import React from 'react'

const LoadingOutline = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <div className="space-y-6">
      <div className="bg-gray-300 dark:bg-gray-700 w-[700px] h-[400px] animate-pulse rounded-lg"></div>
      <div className="bg-gray-300 dark:bg-gray-700 w-[700px] h-10 animate-pulse rounded-lg"></div>
      <div className="bg-gray-300 dark:bg-gray-700 w-[700px] h-24 animate-pulse rounded-lg"></div>
      <div className="flex space-x-4">
        <div className="bg-gray-300 dark:bg-gray-700 w-32 h-12 animate-pulse rounded-lg"></div>
        <div className="bg-gray-300 dark:bg-gray-700 w-32 h-12 animate-pulse rounded-lg"></div>
      </div>
    </div>
  </div>
  )
}

export default LoadingOutline
