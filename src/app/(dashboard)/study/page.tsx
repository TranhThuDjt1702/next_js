"use server";
import { CourseGrid } from "@/components/common";
import Heading from "@/components/common/Heading";
import CourseItem from "@/components/courseAction/courseItem";
import CourseUserItem from "@/components/courseAction/CourseUserItem";
import { IconClock } from "@/components/layout/icons";
import Iconeye from "@/components/layout/icons/IconEye";
import Iconstars from "@/components/layout/icons/IconStars";
import { Icourse } from "@/database/course.model";
import { getAllCourses } from "@/lib/actions/course.actions";
import { getUserCourses } from "@/lib/actions/user.actions";
import { Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { Link } from 'lucide-react'
import React from "react";
import StudyCourse from "./StudyCourse";

const page = async () => {
  const courses = await getUserCourses();
  console.log("courses: ", courses);

  return (
    <div>
      <Heading>Khu vực học tập</Heading>
     <StudyCourse courses={courses ? JSON.parse(JSON.stringify(courses)) : []} />
    </div>
  );
};

export default page;
