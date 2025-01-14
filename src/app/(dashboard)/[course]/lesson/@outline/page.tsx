import Notfound from '@/app/not-found';
import LessonItem from '@/components/lesson/lessonItem'
import { ILesson } from '@/database/lesson.model';
import { getCourseBySlug } from '@/lib/actions/course.actions';
import lessonChecked, { deleteHistory, getHistoryByCourse } from '@/lib/actions/history.action';
import { findAllLesson, getLessonByOne } from '@/lib/actions/lesson.action';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import React, { use, useEffect } from 'react'
import CountLesson from '../CountLesson';
import { IHistory } from '@/database/history.model';

const page = async({
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
    
  const slug =  searchParams.slug|| ""; 
  if(!slug) return <Notfound />
  const course = params.course || "";
  if(!course) return <Notfound />
  const findCourse = await getCourseBySlug({ slug: course });
  if (!findCourse) return <Notfound />;
  const course_id = findCourse._id.toString();
  const findLesson = await getLessonByOne({
    slug,
    course: course_id,
  });
  const lectures = findCourse.lectures;
  const plainLectures = JSON.parse(JSON.stringify(lectures));
  const lessonList = await findAllLesson({ course: course_id || "" });
  const plainLessonList = JSON.parse(JSON.stringify(lessonList));
  const plainFindLesson = JSON.parse(JSON.stringify(findLesson));
  if (!findLesson) return <Notfound />;
  const currenLessonIndex =
    plainLessonList?.findIndex(
      (lesson: ILesson) => lesson.slug === plainFindLesson.slug
    ) || 0;
  const histories = await getHistoryByCourse({ course: course_id });
  const plainHistories = JSON.parse(JSON.stringify(histories));
  const plainLessonExist = plainLessonList?.filter(
    (item: ILesson) => item._destroy === false
  );

  console.log("plainHistories: ", plainHistories);
  console.log("plainLessonExist: ", plainLessonExist);

  return (
    <div className="flex flex-col">
    <div className="relative w-full h-4 bg-gray-200 rounded-full mt-4">
     <CountLesson plainHistories={plainHistories} plainLessonExist={plainLessonExist}   />
    </div>
    <div className="bg-gray-100 p-5 h-[100px] rounded-lg dark:text-white dark:bg-none dark:bg-black mb-20">
      {plainLectures.map((lecture: any) => (
        <Accordion
          key={lecture._id}
          type="single"
          collapsible={true}
          className="w-full m-0 mb-20"
        >
          <AccordionItem value={lecture._id} >
            <AccordionTrigger className="mb-2 cursor-pointer bg-white w-[330px] h-[40px] rounded-lg ">
              <div>{lecture.title}</div>
            </AccordionTrigger>
            <AccordionContent className="bg-gray-100 border-none dark:bg-black">
              <div className="flex flex-col justify-center gap-3">
                {lecture.lesson.map((plainFindLesson: any) => (
                  <LessonItem
                    key={plainFindLesson._id}
                    lesson={plainFindLesson}
                    url={`/${course}/lesson/?slug=${plainFindLesson.slug}`}
                    isactive={plainFindLesson.slug === slug}
                    ischecked={plainHistories.some(
                      (history: any) =>
                        history.lesson === plainFindLesson._id
                    )}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  </div>
  )
}

export default page
