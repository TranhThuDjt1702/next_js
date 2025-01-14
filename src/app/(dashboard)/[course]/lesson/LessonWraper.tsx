"use client";
import { cn } from "@/lib/utils";
import useGlobalStore from "@/store";
import React from "react";

const LessonWraper = ({ children }: { children: React.ReactNode }) => {
    const { expandedPlayer, setExpendPlayer } = useGlobalStore();
  return (
    <div className={cn(`grid lg:grid-cols-[2fr,1fr] gap-10 h-full pl-5 dark:bg-black ${expandedPlayer ? "block" : ""}`)}>
      {children}
    </div>
  );
};

export default LessonWraper;
