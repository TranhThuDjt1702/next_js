import Heading from "@/components/common/Heading";
import CourseupdateContent from "@/components/courseAction/CourseupdateContent";
import Course from "@/database/course.model";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import React from "react";

const Page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  
  const slug = params.slug;
  const findCourse = await getCourseBySlug({ slug });
  if (!findCourse) return <div>Course not found</div>;
  return (
    <div>
      <Heading className="text-purple-600">{findCourse.title}</Heading>
      <CourseupdateContent course={JSON.parse(JSON.stringify(findCourse))} />
    </div>
  );
};

export default Page;