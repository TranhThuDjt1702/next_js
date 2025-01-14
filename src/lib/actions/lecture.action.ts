"use server";
import {
  TCreateLectureParams,
  TEditLessonParams,
  TUpdateLectureParams,
} from "@/app/types/index.d";
import { connectToDatabase } from "../mongoose";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import { revalidatePath } from "next/cache";
import Lesson from "@/database/lesson.model";

export async function createLeture(params: TCreateLectureParams) {
  try {
    connectToDatabase();
    const findcourse = await Course.findById(params.course);
    const newLecture = await Lecture.create(params);
    await findcourse.lectures.push(newLecture._id);
    await findcourse.save();
    revalidatePath(`/manage/course/update-content/${findcourse.slug}`);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateLecture(params: TUpdateLectureParams) {
  try {
    connectToDatabase();
    console.log("params: ", params);
    const res = await Lecture.findByIdAndUpdate(
      params.lectureId,
      params.updateData,
      {
        new: true,
      }
    );
    if (!res) return { success: false };
    revalidatePath(params.updateData.path || "/");
    // console.log("res: ", res);
    return { success: true };
  } catch (error) {
    console.log(error);
  }
}
