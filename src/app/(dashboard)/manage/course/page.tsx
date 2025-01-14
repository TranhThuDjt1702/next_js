import CourseManage from "@/components/courseAction/CourseManage";
import { EcourseStatus } from "@/contants/enums";
import { getAllCourses, getAllCoursesInDB } from "@/lib/actions/course.actions";
import React from "react";


const page = async ({
  searchParams,
}: {
  searchParams:Promise<{
    page?: number;
    search?: string;
    status?: string; // Thay vì `EcourseStatus`, để dạng `string` trước khi ánh xạ
  }>;
}) => {
  const params = await searchParams;
  const limit = 5;
  // console.log("searchParams:", searchParams);
  const status = Object.values(EcourseStatus).includes(params.status as EcourseStatus) ? params.status as EcourseStatus : undefined;
  const courses = await getAllCourses({
    page: params.page || 1,
    limit: limit,
    search: params.search|| "",
    status,
  });

  const courseInDB = await getAllCoursesInDB();

  const limitPage = Math.ceil((courseInDB?.length ?? 0) / limit);

  // console.log("searchParams.status:", searchParams.search); 

  return (
    <div className="pb-3">
      <CourseManage
        courses={courses ? JSON.parse(JSON.stringify(courses)) : []}
        limitPage={limitPage}
      ></CourseManage>
    </div>
  );
};

export default page;
