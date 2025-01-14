"use server";

import { connectToDatabase } from "../mongoose";
import History, { IHistory } from "../../database/history.model";
import { TCreateHistoryParams } from "@/app/types/index.d";
import { revalidatePath } from "next/cache";
import Lesson from "@/database/lesson.model";
import Course from "@/database/course.model";
import { fail } from "assert";

export async function createHistory(params: TCreateHistoryParams) {
  try {
    await connectToDatabase();
    if (params.checked) {
      const newHistory = await History.create({
        course: params.course,
        lesson: params.lesson,
        checked: params.checked,
      });
    } else {
      await History.findOneAndDelete({
        course: params.course,
        lesson: params.lesson,
      });
    }
    console.log("params: ", params);    
    // console.log("newHistory: ", newHistory);
  } catch (error) {
    console.log(error);
  }
}

export async function getHistoryByCourse(params: {
    course :string
}):Promise<IHistory[] | undefined> {
  try {
    connectToDatabase();
    const historis = await History.find({ course: params.course });
    // console.log("history: ", historis); 
    return historis;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteHistory(params: {
  course: string;
  lesson: string;
}) {
  try {
    await connectToDatabase();
    await History.findOneAndDelete({
      course: params.course,
      lesson: params.lesson,
    });
  } catch (error) {
    console.log(error);
  }
}

export default async function lessonChecked(params: {
  lesson: string;
  course: string;
}) {
  try {
    connectToDatabase();
    const findCourse =  await Course.findOne({ _id: params.course });
    if(!findCourse) return false;
    const findLesson = await Lesson.findOne({ _id: params.lesson });
    if(!findLesson) return false;
    return true;
  } catch (error) {
    console.log(error);
  }
}