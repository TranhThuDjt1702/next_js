"use server";
import { TCreateLessonParams, TEditLessonParams } from "@/app/types/index.d";
import { connectToDatabase } from "../mongoose";
import Lesson, { ILesson } from "@/database/lesson.model";
import Lecture from "@/database/lecture.model";
import Course from "@/database/course.model";
import { revalidatePath } from "next/cache";
import { Console } from "console";

export async function createLesson(params: TCreateLessonParams) {
  try {
    connectToDatabase();
    const findCourse = await Course.findById(params.course);
    // console.log("findCourse: ", findCourse);
    if (!findCourse)
      return { success: false, message: "Không tìm thấy khóa học" };
    const findLecture = await Lecture.findById(params.lecture);
    // console.log("findLecture: ", findLecture);
    if (!findLecture)
      return { success: false, message: "Không tìm thấy Lecture" };
    const newLesson = await Lesson.create({
      title: params.title,
      slug: params.slug,
      duration: params.duration,
      lecture: params.lecture,
      course: params.course,
    });
    // console.log("newLesson: ", findLecture.lesson);
    // await findCourse.lectures.push(newLesson._id);
    await findLecture.lesson.push(newLesson._id);
    // console.log("findLecture.lesson: ", findLecture.lesson);
    await findLecture.save();
    revalidatePath(params.path || "/");
    if (!newLesson) return { success: false, message: "Tạo bài học thất bại" };
    return { success: true, message: "Tạo bài học thành công" };
  } catch (error) {
    console.log(error);
  }
}

export async function updateLesson(params: TEditLessonParams) {
  try {
    connectToDatabase();
    console.log("params: ", params);
    const res = await Lesson.findByIdAndUpdate(
      params.lessonId,
      params.updateData,
      {
        new: true,
      }
    );
    if (!res) return { success: false };
    revalidatePath(params.path || "/");
    // console.log("res: ", res);
    return { success: true };
  } catch (error) {
    console.log(error);
  }
}
export async function getLessonByOne({
  slug,
  course,
}: {
  slug: string;
  course: string;
}): Promise<ILesson | undefined> {
  try {
    connectToDatabase();
    const findLesson = await Lesson.findOne({ slug: slug, course: course })
    // console.log("findcourse: ", findLesson);
    if (!findLesson) return undefined;
    return findLesson;
  } catch (error) {
    console.log(error);
  }
}

export async function findAllLesson({
  course,
}: {
  course: string;
}): Promise<ILesson[] | undefined> {
  try {
    await connectToDatabase();
    const findLesson = await Lesson.find({ course: course });
    // console.log("findcourse: ", findLesson);
    if (!findLesson) return undefined;
    // console.log("findLesson: ", findLesson);
    return findLesson;
  } catch (error) {
    console.log(error);
  }
}

