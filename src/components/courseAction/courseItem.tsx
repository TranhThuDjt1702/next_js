"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { IconClock, IconEye } from "../layout/icons";
import Iconstars from "../layout/icons/IconStars";
import { Icourse } from "@/database/course.model";

const CourseItem = ({ data }: { data: Icourse }) => {
  const ratings = data.rating.reduce((a, b) => a + b, 0) / data.rating.length;  
  const courseInfos = [
    {
      title: data.views,
      icon: (className?: string) => <IconEye className={className} />,
    },
    {
      title: ratings,
      icon: (className?: string) => <Iconstars className={className} />,
    },
    {
      title: "20p",
      icon: (className?: string) => <IconClock className={className} />,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 p-5 flex justify-center rounded-2xl relative flex-col dark:bg-gray-800 ml-4">
      <Link href={`course/${data.slug}`} className="block h-[200px]">
        <Image
          src={data.image ? data.image : "https://i.pinimg.com/736x/a4/52/ea/a452eae371f079b141494c5aff07a140.jpg"}
          alt=""
          width={300}
          height={300}
          className="h-full w-full object-cover rounded-lg"
        />
        <span className="inline-block px-3 py-1 rounded-full absolute top-7 right-7 z-10 text-white bg-black text-xs">
          new
        </span>
      </Link>

      <h2 className="mt-2 text-sm font-bold">{data.title}</h2>

      <div className="flex items-center gap-3 mt-6 text-gray-600 mb-6 justify-between ">
        <div className="flex items-center gap-3 mt-6 text-gray-600 mb-6 dark:text-white">
          {courseInfos.map((courseInfo, index) => (
            <div key={index} className="flex items-center text-xs gap-1">
              {courseInfo.icon("w-4 h-4 mr-1")}
              <p>{courseInfo.title}</p>
            </div>
          ))}
        </div>
        <p className="font-bold mr-3 text-purple-800 dark:text-white">
          ${data.sale_price}
        </p>
      </div>

      <Link
        href={`course/${data.slug}`}
        className="mt-3 text-purple-700 bg-purple-200 rounded-full text-center py-2 w-full hover:bg-purple-400 dark:bg-gray-400 dark:text-gray-200 dark:hover:bg-gray-900 transition-all"
      >
        Xem chi tiết
      </Link>
    </div>
  );
};

export default CourseItem;
