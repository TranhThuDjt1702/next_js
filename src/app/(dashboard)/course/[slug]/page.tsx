"use-client";
import { Button } from "@/components/ui/button";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import Image from "next/image";
import React, { use } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ILecture } from "@/database/lecture.model";
import Notfound from "@/app/not-found";
import { ILesson } from "@/database/lesson.model";
import { IconPlay } from "@/components/layout/icons";
import LessonItem from "@/components/lesson/lessonItem";
import { useRouter } from "next/navigation";
import ButtonNavigate from "./ButtonNavigate";
import { getAllUser, getUserCourses } from "@/lib/actions/user.actions";
import Link from "next/link";

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const slug = params.slug;
  const data = await getCourseBySlug({ slug: slug });
  if (!data) {
    return (
      <div>
        <Notfound />
      </div>
    );
  }
  const courseData = JSON.parse(JSON.stringify(data));
  console.log("courseData: ", courseData);
  const price = Number(courseData.price);
  const salePrice = Number(courseData.sale_price);
  const videoId = courseData.intro_url?.split("v=")[1];
  function average(array: number[]): number {
    const sum = array.reduce((acc: number, num: number) => acc + num, 0);
    return array.length === 0 ? 0 : sum / array.length;
  }
  let discountPercentage;
  if (!price || !salePrice) {
    discountPercentage = 0;
  } else {
    discountPercentage =
      ((courseData.price - courseData.sale_price) / courseData.price) * 100;
  }
  const lectures = courseData.lectures || [];
  const userCourse = await getUserCourses();
  const userCourseLength = userCourse.length;
  const users = await getAllUser();
  const user = users[0];
  const userCourses: string[] = user?.courses.map((c) => c.toString()) || [];

  console.log("courseData: ", courseData._id);

  return (
    <div className="grid lg:grid-cols-[2fr,1fr] gap-10 h-full pl-5 dark:bg-black">
      <div className="flex-col justify-center pb-4 h-full dark:bg-black">
        <div className="relative w-[700px] h-[454px] ">
          {courseData.intro_url ? (
            <>
              <iframe
                width="871"
                height="490"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Post Malone, Swae Lee - Sunflower (Spider-Man: Into the Spider-Verse) (Official Video)"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="rounded-2xl w-[750px] h-[454px]"
              ></iframe>
            </>
          ) : (
            <Image
              src={courseData.image || "/image/placeholder.jpg"}
              alt=""
              fill
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        <div className="pl-1 pt-4 flex flex-col gap-4 w-[700px]">
          <h1 className="font-bold text-2xl ">{courseData.title}</h1>
          <BoxInfo title="Mô tả">{courseData.desc}</BoxInfo>
          <BoxInfo title="Thông tin">
            {" "}
            <div className="grid grid-cols-5 gap-5 mb-10p pt-2 ">
              <BoxSection title="Bài học">127</BoxSection>
              <BoxSection title="Lượt xem">{courseData.views}</BoxSection>
              <BoxSection title="Trình độ">
                {courseData.level.toLowerCase()}
              </BoxSection>
              <BoxSection title="Thời lượng">120p</BoxSection>

              <BoxSection title="Đánh giá">
                {courseData.rating.length !== 0
                  ? average(courseData.rating)
                  : "Chưa có đánh giá "}{" "}
              </BoxSection>
            </div>
          </BoxInfo>
          <BoxInfo title="Nội dung khóa học">
            {" "}
            <div className="flex flex-col gap-2 ">
              {lectures.map((lecture: any) => (
                <Accordion
                  key={lecture._id}
                  type="single"
                  collapsible={true}
                  className="w-full m-0"
                >
                  <AccordionItem value={lecture._id}>
                    <AccordionTrigger className="mb-2">
                      <div>{lecture.title}</div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-gray-100 border-none dark:bg-black">
                      <div className="flex flex-col justify-center gap-3">
                        {lecture.lesson.map((lesson: any) => (
                          <LessonItem
                            key={lesson._id}
                            lesson={lesson}
                            url={lesson.slug}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </BoxInfo>
          <BoxInfo title="Yêu cầu">
            <h2 className="pl-2 text-m flex flex-col gap-2">
              {courseData.info.requiment.map((item: string, index: number) => (
                <span key={index} className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 text-purple-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {item}
                </span>
              ))}
            </h2>
          </BoxInfo>
          <BoxInfo title="Lợi ích">
            <h2 className="pl-2 text-m flex flex-col gap-2">
              {courseData.info.benefits.map((item: string, index: number) => (
                <span className="flex gap-2 items-center" key={index}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 text-purple-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {item}
                </span>
              ))}
            </h2>
          </BoxInfo>
          <BoxInfo title="Q&A">
            <h2 className="pl-2 text-m flex flex-col gap-2">
              {courseData.info.qa.map((item: any, index: number) => (
                <Accordion type="single" collapsible key={index}>
                  <AccordionItem value={item.question}>
                    <AccordionTrigger>
                      Câu hỏi số {index + 1}: {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </h2>
          </BoxInfo>
        </div>
      </div>
      {userCourses.includes(courseData._id) ? (
        <div className="bg-white p-5 h-fit rounded-lg dark:bg-gray-800 dark:text-white ">
          <span className="text-sm opacity-70">{courseData.title}</span>
          <div className="flex pt-3 items-center justify-between">
            <div className="flex gap-4 items-center">
              <strong className="text-xl">
                ${courseData.sale_price.toLocaleString("en-EN")}
              </strong>
              <span className="line-through opacity-40">
                ${courseData.price.toLocaleString("en-EN")}
              </span>
            </div>
            <div className="rounded-lg bg-gray-500 w-fit pl-2 pr-2 ">
              {discountPercentage}%
            </div>
          </div>
          <div className="flex flex-col pt-4 gap-3">
            <span>Course include</span>
            <ul className="text-sm opacity-70 flex flex-col gap-1">
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                  />
                </svg>
                {courseData.status.toLowerCase()}
              </li>

              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>
                {courseData.level.toLowerCase()}
              </li>
            </ul>
          </div>
          <div className=" flex  flex-col items-center justify-center mt-8 bg-gray-800 rounded-lg text-white pt-2 pb-2">
            <span>Khóa học đã được mua</span>
            <Link href="/study" className="hover:text-purple-400 font-bold">
              quay lại khu vực học tập
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 h-fit rounded-lg dark:bg-gray-800 dark:text-white ">
          <span className="text-sm opacity-70">{courseData.title}</span>
          <div className="flex pt-3 items-center justify-between">
            <div className="flex gap-4 items-center">
              <strong className="text-xl">
                ${courseData.sale_price.toLocaleString("en-EN")}
              </strong>
              <span className="line-through opacity-40">
                ${courseData.price.toLocaleString("en-EN")}
              </span>
            </div>
            <div className="rounded-lg bg-gray-500 w-fit pl-2 pr-2 ">
              {discountPercentage}%
            </div>
          </div>
          <div className="flex flex-col pt-4 gap-3">
            <span>Course include</span>
            <ul className="text-sm opacity-70 flex flex-col gap-1">
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13.5H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                  />
                </svg>
                {courseData.status.toLowerCase()}
              </li>

              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>
                {courseData.level.toLowerCase()}
              </li>
            </ul>
          </div>
          <ButtonNavigate
            userCourseLength={userCourseLength}
            courseId={courseData._id}
            amount={courseData.sale_price}
          >
            Buy now
          </ButtonNavigate>
        </div>
      )}
    </div>
  );
};
function BoxInfo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-bold text-xl">{title}</h2>
      <div className="text-m">{children}</div>
    </div>
  );
}
function BoxSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg flex flex-col justify-center items-center pb-2 dark:bg-gray-700 ">
      <h2 className="font-bold pb-2 pt-2">{title}</h2>
      <span className="text-sm opacity-80 pb-2">{children}</span>
    </div>
  );
}

export default page;
