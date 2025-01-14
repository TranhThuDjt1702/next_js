
import CourseGrid from '@/components/common/CourseGrid'
import Heading from '@/components/common/Heading'
import CourseItem from '@/components/courseAction/courseItem'
import { getAllCourses, getAllCoursesInDB } from '@/lib/actions/course.actions'
import { createUser } from '@/lib/actions/user.actions'
import React from 'react'

const Page = async () => {
  //   const user = await createUser({
  //     clerkId: "123",  
  //     email: "admobile17022005",
  //     userName: 'nguyen ha',
  //     name: 'nguyen ha'
  //   },
  // );
  // console.log(user)
    const courses = await getAllCoursesInDB() || []
    return (
      <div className="w-full">
        <Heading>Khám phá</Heading>
        <CourseGrid>
          {courses.length > 0 && courses?.map((course)=>(
            <CourseItem key={course.slug} data={course}></CourseItem>
          ))}
        </CourseGrid>
      </div>
    );
};

export default Page;
