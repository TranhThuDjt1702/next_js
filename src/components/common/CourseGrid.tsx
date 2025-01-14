"use client";
import React from "react";

const CourseGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="md:grid xl:grid-cols-3 gap-8 mt-8 w-full md:grid-cols-2 grid-cols-1 flex flex-col">{children}</div>
  );
};

export default CourseGrid;
