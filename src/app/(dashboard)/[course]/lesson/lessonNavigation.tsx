"use client";
import { IconLeft, IconRight } from "@/components/layout/icons";
import { Button } from "@/components/ui/button";
import { ILesson } from "@/database/lesson.model";
import { useRouter } from "next/navigation";

import React from "react";

const LessonNavigation = ({
  nextLesson,
  prevLesson,
  course,
}: {
  nextLesson: ILesson | undefined;
  prevLesson: ILesson | undefined;
  course: string;
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 ">
      <Button
        onClick={() => router.push(`/${course}/lesson?slug=${prevLesson?.slug}`)}
        disabled={!prevLesson}
      >
        <IconLeft />
      </Button>
      <Button
        onClick={() => router.push(`/${course}/lesson?slug=${nextLesson?.slug}`)}
        disabled={!nextLesson}
      >
        <IconRight />
      </Button>
    </div>
  );
};

export default LessonNavigation;
