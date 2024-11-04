import { CourseGrid } from '@/components/common'
import CourseItem from '@/components/course/courseItem'
import React from 'react'

const page = () => {
  return (
    <div>
      Day la studypage
      <CourseGrid>
      <CourseItem></CourseItem>
      <CourseItem></CourseItem>
      <CourseItem></CourseItem>
    </CourseGrid>
    </div>
  )
}

export default page
