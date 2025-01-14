"use client";
import { Icourse } from "@/database/course.model";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  IconAdd,
  IconCancel,
  IconCheck,
  IconDelete,
  IconEdit,
} from "../layout/icons";
import { Button } from "../ui/button";
import {
  createLeture,
  updateLecture,
} from "@/lib/actions/lecture.action";
import { toast } from "react-toastify";
import { revalidatePath } from "next/cache";
import Swal from "sweetalert2";
import {
  IcourseUpdateParams,
  TCreateCourseParams,
  TCreateLessonParams,
  TUpdateLessonParams,
} from "@/app/types/index.d";
import { Input } from "../ui/input";
import { createLesson, updateLesson } from "@/lib/actions/lesson.action";
import { set } from "mongoose";
import { ILecture } from "@/database/lecture.model";
import slugify from "slugify";
import Lesson from "@/database/lesson.model";
import LessonItemUpdate from "../lesson/LessonItemUpdate";

const CourseupdateContent = ({ course }: { course: TCreateCourseParams }) => {
  // console.log("course:  ",course);
  const lectures = course.lectures;
  // console.log("lesson:  ", lectures[0].lesson);
  const [idLecture, setIdLecture] = useState("");
  const [titleLecture, setTitleLecture] = useState("");
  const [titleLesson, setTitleLesson] = useState("");
  const [idLesson, setIdLesson] = useState("");
  const addLectureBtn = async () => {
    try {
      const res = await createLeture({
        title: "New lecture",
        course: course._id,
        order: lectures.length,
        path: `/manage/course/update-content/${course.slug}`,
      });

      if (res?.success) {
        toast.success("Thêm chương thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBtn = async (
    e: React.MouseEvent<HTMLSpanElement>,
    lectureId: string
  ) => {
    e.stopPropagation();
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        const res = await updateLecture({
          lectureId,
          updateData: {
            _destroy: true,
            path: `/manage/course/update-content/${course.slug}`,
          },
        });
        console.log("res: ", res);
        if (res?.success) {
          toast.success("Xóa chương thành công");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLesson = async (
    e: React.MouseEvent<HTMLSpanElement>,
    lessonId: string,
  ) =>{
    e.stopPropagation();
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        const res = await updateLesson({
          course: course._id,
          lessonId,
          updateData: {
            _destroy: true,
          },
          path: `/manage/course/update-content/${course.slug}`,
        });
        console.log("res: ", res);
        if (res?.success) {
          toast.success("Xóa bài học thành công");
        }
      });
    }  catch (error) {
      toast.error("Xóa bài học thất bại");
    }
  }

  // console.log("titleLesson: ", titleLesson);

  const handleEditBtn = async (
    e: React.MouseEvent<HTMLSpanElement>,
    lectureId: string
  ) => {
    e.stopPropagation();
    try {
      const res = await updateLecture({
        lectureId,
        updateData: {
          title: titleLecture,
        },
      });
      if (res?.success) {
        toast.success("Cập nhật chương thành công");
      }
      setIdLecture("");
    } catch (error) {
      toast.error("Cập nhật chương thất bại");
    }
  };
  const addLessonBtn = async (courseId: string, lectureId: string) => {
    // console.log("courseId: ", courseId);
    // console.log("lectureId: ", lectureId);
    try {
      const res = await createLesson({
        course: courseId,
        lecture: lectureId,
        path: `/manage/course/update-content/${course.slug}`,
        title: "New lesson",
        slug: `new-lesson-${new Date().getTime().toString().slice(-3)}`,
        duration: 0,
      });
      if (res?.success) {
        toast.success("Thêm bài học thành công");
        return;
      } else {
        toast.error("Thêm bài học thất bại");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditLesson = async (
    e: React.MouseEvent<HTMLSpanElement>,
    lessonId: string
  ) => {
    e.stopPropagation();
    try {
      const res = await updateLesson({
        course: course._id,
        lessonId,
        updateData: {
          title: titleLesson,
          slug: slugify(titleLesson, { lower: true, locale: "vi", remove: /[*+~.()'"!:@]/g }),
        },
      });
      setIdLesson("");
      if (res?.success) {
        toast.success("Cập nhật bài học thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="flex flex-col gap-5">
      {lectures.map((lecture: TUpdateLessonParams) => (
        <div key={lecture._id}>
          <Accordion
            key={lecture._id}
            type="single"
            collapsible={true}
            className="w-full"
          >
            <AccordionItem value={lecture._id}>
              <AccordionTrigger>
                <div className="flex items-center w-full justify-between">
                  {lecture._id === idLecture ? (
                    <>
                      <div
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          type="text"
                          className="w-full h-[35px] text-sm outline-purple-400 pl-2 bg-white border-none "
                          placeholder="Tên chương "
                          defaultValue={lecture.title}
                          // value={titleLecture}
                          onChange={(e) => setTitleLecture(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2 pr-2 pl-2">
                        <span
                          className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200"
                          onClick={(e) => handleEditBtn(e, lecture._id)}
                        >
                          <IconCheck />
                        </span>
                        <span
                          className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIdLecture("");
                          }}
                        >
                          <IconCancel />
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{lecture.title}</span>
                      <div className="flex items-center gap-2 pr-2">
                        <span
                          className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200 text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIdLecture(lecture._id);
                          }}
                        >
                          <IconEdit />
                        </span>
                        <span
                          className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200 text-red-600"
                          onClick={(e) => handleDeleteBtn(e, lecture._id)}
                        >
                          <IconDelete />
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="bg-gray-100 p-0 m-0">
                {Array.isArray(lecture.lesson) &&
                  lecture.lesson.map((lesson) => (
                    <Accordion type="single" collapsible key={lesson._id}>
                      <AccordionItem value={lesson._id}>
                        <AccordionTrigger>
                          <div className="flex items-center w-full justify-between">
                            {lesson._id === idLesson ? (
                              <>
                                <div
                                  className="w-full"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Input
                                    type="text"
                                    className="w-full h-[35px] text-sm outline-purple-400 pl-2 bg-white border-none "
                                    placeholder="Tên bài học "
                                    defaultValue={lesson.title}
                                    // value={titleLecture}
                                    onChange={(e) =>
                                      setTitleLesson(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="flex items-center gap-2 pr-2 pl-2">
                                  <span
                                    className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200"
                                    onClick={(e) =>
                                      handleEditLesson(e, lesson._id)
                                    }
                                  >
                                    <IconCheck />
                                  </span>
                                  <span
                                    className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIdLesson("");
                                    }}
                                  >
                                    <IconCancel />
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <span>{lesson.title}</span>
                                <div className="flex items-center gap-2 pr-2">
                                  <span
                                    className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200 text-blue-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIdLesson(lesson._id);
                                    }}
                                  >
                                    <IconEdit />
                                  </span>
                                  <span
                          className="border rounded-lg h-8 w-8 flex items-center justify-center hover:bg-gray-200 text-red-600"
                          onClick={(e) => handleDeleteLesson(e, lesson._id)}
                        >
                          <IconDelete />
                        </span>
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <LessonItemUpdate lesson={lesson}></LessonItemUpdate>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex items-center gap-2 mt-2">
            <Button
              onClick={() => addLessonBtn(course._id, lecture._id)}
              className="rounded-full ml-4  bg-gray-600 h-6"
            >
              <IconAdd />
            </Button>
            <span className="font-bold text-sm">Thêm bài học</span>
          </div>
        </div>
      ))}

      <Button onClick={addLectureBtn} className="mt-5 ml-2 mb-10">
        Thêm chương
      </Button>
    </div>
  );
};

export default CourseupdateContent;
