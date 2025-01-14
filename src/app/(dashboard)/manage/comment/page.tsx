import Heading from "@/components/common/Heading";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCoursesInDB } from "@/lib/actions/course.actions";
import CommentContent from "./CommentContent";
const page = async() => {
  const courseList = await getAllCoursesInDB() || [];
  
  return (
    <div>
      <Heading>Quản lý bình luận</Heading>
      <CommentContent courseList={courseList} />
    </div>
  );
};

export default page;
