"use client";
import React, { useEffect } from "react";

const LessonLeft = ({ url, course }: { url: string; course: string }) => {
  useEffect(() => {
    let result = JSON.parse(localStorage?.getItem("lastlesson") || "[]");
    const item = {
      course,
      url,
    };
    result = result.filter((item: any) => item.course !== course);
    result.push(item);
    localStorage.setItem("lastlesson", JSON.stringify(result));
  }, [url, course]);
  return null;
};

export default LessonLeft;
