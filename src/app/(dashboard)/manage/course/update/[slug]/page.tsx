import Heading from "@/components/common/Heading";
import CourseAddNew from "@/components/courseAction/CourseAddNew";
import Courseupdate from "@/components/courseAction/CourseUpdate";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import React, { useEffect } from "react";

const page = async ({
  params,
}: {
  params: {
    slug: String;
  };
}) => {
  const { slug } = await params;
  const findCourse = await getCourseBySlug({ slug });
  // console.log("dayla",findCourse)
  if (!findCourse) {
    return null;
  }
  // const slugParam = await params.slug
  return (
    <div className="min-h-screen w-full dark:bg-black dark:text-gray-200 flex flex-col pb-10 ">
      <Heading>Edit coursedetail</Heading>
      <Courseupdate
        data={JSON.parse(JSON.stringify(findCourse))}
      ></Courseupdate>
    </div>
  );
};

export default page;
