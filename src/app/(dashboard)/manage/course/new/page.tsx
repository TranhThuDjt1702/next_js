import Heading from "@/components/common/Heading";
import CourseAddNew from "@/components/courseAction/CourseAddNew";
import React, { useEffect } from "react";


const page = async () => {
  return (
    <div>
      <Heading>day la khoa hoc moi</Heading>
      <CourseAddNew></CourseAddNew>
    </div>
  );
};

export default page;
