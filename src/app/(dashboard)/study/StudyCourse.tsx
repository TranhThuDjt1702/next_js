"use client";
import Notfound from "@/app/not-found";
import { CourseGrid } from "@/components/common";
import { IconClock } from "@/components/layout/icons";
import Iconeye from "@/components/layout/icons/IconEye";
import Iconstars from "@/components/layout/icons/IconStars";
import { Icourse } from "@/database/course.model";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const StudyCourse = ({ courses }: { courses: Icourse[] }) => {
  if (!courses) return <Notfound />;
  const lastlesson = JSON.parse(localStorage?.getItem("lastlesson") || "[]");

  return (
    <div>
      <CourseGrid>
        {courses.length > 0 &&
          courses?.map((course: any, index) => {
            const url = lastlesson.find((el:any)=>el.course === course.slug)?.url || "";
            return(
            <div key={index} className="bg-white border border-gray-200 p-5 flex justify-center rounded-2xl relative flex-col dark:bg-gray-800 ml-4">
              <Link href={url} className="block h-[200px]">
                <Image
                  src={
                    course.image
                      ? course.image
                      : "https://i.pinimg.com/736x/a4/52/ea/a452eae371f079b141494c5aff07a140.jpg"
                  }
                  alt=""
                  width={300}
                  height={300}
                  className="h-full w-full object-cover rounded-lg"
                />
                <span className="inline-block px-3 py-1 rounded-full absolute top-7 right-7 z-10 text-white bg-black text-xs">
                  new
                </span>
              </Link>

              <h2 className="mt-2 text-sm font-bold">{course.title}</h2>

              <div className="flex items-center gap-3 mt-6 text-gray-600 mb-6 justify-between ">
                <div className="flex items-center gap-3 mt-6 text-gray-600 mb-6 dark:text-white">
                  <div className="flex items-center text-xs gap-1">
                    <Iconeye className='"w-4 h-4 mr-1"' />
                    <p>{course.views}</p>
                  </div>
                  <div className="flex items-center text-xs gap-1">
                    <Iconstars className='"w-4 h-4 mr-1"' />
                    <p>
                      {course.rating.reduce((a: any, b: any) => a + b, 0) /
                        course.rating.length}
                    </p>
                  </div>
                  <div className="flex items-center text-xs gap-1">
                    <IconClock className='"w-4 h-4 mr-1"' />
                    <p>{"20p"}</p>
                  </div>
                </div>
                <p className="font-bold mr-3 text-purple-800 dark:text-white">
                  ${course.sale_price}
                </p>
              </div>

              <Link
                href={url}
                className="mt-3 text-purple-700 bg-purple-200 rounded-full text-center py-2 w-full hover:bg-purple-400 dark:bg-gray-400 dark:text-gray-200 dark:hover:bg-gray-900 transition-colors ease-in-out"
              >
                Học tiếp
              </Link>
            </div>)
})}
      </CourseGrid>
    </div>
  );
};

export default StudyCourse;
