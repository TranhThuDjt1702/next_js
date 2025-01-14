"use client";
import React from "react";
import { IconPlay } from "../layout/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import {
  createHistory,
  getHistoryByCourse,
} from "@/lib/actions/history.action";


const LessonItem = ({
  lesson,
  url,
  isactive = false,
  ischecked,

}: {
  lesson: {
    title: string;
    duration: number;
    course: string;
    _id: string;
  };
  url?: string;
  isactive?: boolean;
  ischecked?: boolean;

}) => {

  const handleCompleteLesson = async (checked: boolean | string) => {
    try {
      const res = await createHistory({
        course: lesson.course,
        lesson: lesson._id,
        checked: checked,
      });
      console.log("res: ", res);
      window.location.reload(); 
    } catch (error) {
      console.log("error: ", error);
    }
  };
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 bg-white rounded-lg p-3 cursor-pointer dark:bg-gray-800 hover:text-purple-700",
        isactive ? " font-bold" : ""
      )}
    >
      <div className="flex items-center gap-2 ">
        <Checkbox
          defaultChecked={ischecked}
          onCheckedChange={(checked) => handleCompleteLesson(checked)}
        />
        <IconPlay className="size-4" />
        {url ? <Link href={url}>{lesson.title}</Link> : <h4>{lesson.title}</h4>}
      </div>
      <span className="flex gap-1 items-center">
        {lesson.duration}
        <span>phút</span>
      </span>
    </div>
  );
};

export default LessonItem;
