"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { IconClock, IconEye } from "../layout/icons";
import Iconstars from "../layout/icons/IconStars";
import { Icourse } from "@/database/course.model";

const CourseUserItem = ({ data }: { data: Icourse }) => {


  return (
    <div className="bg-white border border-gray-200 p-5 flex justify-center rounded-2xl relative flex-col dark:bg-gray-800 ml-4">
      <span>{data.title}</span>
    </div>
  );
};

export default CourseUserItem;
