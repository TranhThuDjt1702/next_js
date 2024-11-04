import CourseGrid from '@/components/common/CourseGrid'
import CourseItem from '@/components/course/courseItem'
import Heading from '@/components/typography/heading'
import { createUser } from '@/lib/actions/user.actions'
import { User } from 'lucide-react'
import React from 'react'

const Page = async () => {
    const user = await createUser({
      clerkId: "123",  
      email_address: "admobile17022005",
      userName: 'nguyen ha',
      name: 'nguyen ha'
    },
  );
  console.log(user)

    return (
      <div className="w-full">
        <Heading>Khám phá</Heading>
        <CourseGrid>
          <CourseItem></CourseItem>
          <CourseItem></CourseItem>
          <CourseItem></CourseItem>
        </CourseGrid>
      </div>
    );
};

export default Page;
