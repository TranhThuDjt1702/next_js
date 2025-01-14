import React from "react";
import LessonNavigation from "../lessonNavigation";
import Notfound from "@/app/not-found";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { findAllLesson, getLessonByOne } from "@/lib/actions/lesson.action";
import { ILesson } from "@/database/lesson.model";
import LessonLeft from "../LessonLeft";
import MuxPlayer from "@mux/mux-player-react";
import VideoList from "./VideoList";
// import LessonLeft from '@/components/lesson/LessonLeft';

const page = async ({
  params,
  searchParams,
}: {
  params: {
    course: string;
  };
  searchParams: {
    slug: string;
  };
}) => {
  const slug = searchParams.slug || "";
  if (!slug) return <Notfound />;
  const course = params.course || "";
  if (!course) return <Notfound />;
  const findCourse = await getCourseBySlug({ slug: course });
  if (!findCourse) return <Notfound />;
  const course_id = findCourse._id.toString();
  const findLesson = await getLessonByOne({
    slug,
    course: course_id,
  });
  const lessonList = await findAllLesson({ course: course_id || "" });
  // console.log("lessonList: ", lessonList);
  const plainLessonList = JSON.parse(JSON.stringify(lessonList));
  const plainFindLesson = JSON.parse(JSON.stringify(findLesson));
  if (!findLesson) return <Notfound />;
  const currenLessonIndex =
    plainLessonList?.findIndex(
      (lesson: ILesson) => lesson.slug === plainFindLesson.slug
    ) || 0;
  const nextLesson = plainLessonList?.[currenLessonIndex + 1];
  // console.log("nextlesson",nextLesson)
  // console.log(plainLessonList);
  const prevLesson = plainLessonList?.[currenLessonIndex - 1];
  const video_id = plainFindLesson.video_url?.includes("v=")
    ? plainFindLesson.video_url.split("v=").at(-1)
    : null;
  const url = `/${course}/lesson?slug=${slug}`;
  // const nextUrl = `/${course}/lesson?slug=${nextLesson.slug}`;

  return (
    <div>
      <LessonLeft url={url} course={course} />
      <div className="flex-col justify-center pb-4 h-full dark:bg-black">
        {video_id ? (
            <VideoList nextLesson={nextLesson} course={course} prevLesson={prevLesson}  />
         ) : (
          <div className="w-[700px] h-[400px] flex items-center justify-center bg-white text-3xl dark:bg-gray-800 text-gray-600">
            No image
          </div>
        )}
        <h1 className="text-3xl font-bold pt-4">{plainFindLesson.title}</h1>
        <div className="p-5 rounded-lg bg-white border dark:bg-gray-700 mt-5 mr-8">
          <p>{plainFindLesson.content}</p>
        </div>
      </div>
    </div>
  );
};

export default page;
