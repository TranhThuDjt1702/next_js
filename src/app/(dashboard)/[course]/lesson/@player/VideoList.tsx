"use client";
import { ILesson } from "@/database/lesson.model";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LessonNavigation from "../lessonNavigation";
import useGlobalStore from "@/store";
import { Button } from "@/components/ui/button";

const VideoList = ({
  nextLesson,
  course,
  prevLesson,
}: {
  nextLesson: ILesson;
  course: string;
  prevLesson: ILesson;
}) => {
  const [isEnded, setIsEnded] = useState(false);
  const { expandedPlayer, setExpendPlayer } = useGlobalStore();
  const router = useRouter();
  useEffect(() => {
    if (!isEnded) {
      console.log("not ended");
    } else {
      const timer = setTimeout(() => {
        router.push(`/${course}/lesson?slug=${nextLesson.slug}`);
      }, 5000);
      // return () => clearTimeout(timer);
    }
  }, [isEnded]);
  return (
    <>
      <div>
        <div
          className={cn(
            " h-1.5 bg-gradient-to-r from-purple-400 to-purple-500 top-0 left-0 z-10",
            isEnded ? "animate-bar" : ""
          )}
        ></div>
        <MuxPlayer
          playbackId="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
          metadata={{
            video_id: "video-id-54321",
            video_title: "Test video title",
            viewer_user_id: "user-id-007",
          }}
          onEnded={() => setIsEnded(true)}
          onPlay={() => setIsEnded(false)}
        />
      </div>
      <div className="flex items-center justify-between mt-5">
      <LessonNavigation
        nextLesson={nextLesson}
        prevLesson={prevLesson}
        course={course}
      />
      <Button onClick={()=>setExpendPlayer(!expandedPlayer)}>{expandedPlayer? "Mặc định" : "Mở rộng"}</Button>
      </div>
    </>
  );
};

export default VideoList;
