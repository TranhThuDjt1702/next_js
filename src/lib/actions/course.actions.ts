"use server";
import {
  EGetAllCourseParams,
  TAddCommentToCourseParams,
  TCreateCourse,
  TCreateCourseParams,
  TUpdateCourse,
  TUpdateCourseToCouponParams,
} from "@/app/types/index.d";
import { connectToDatabase } from "../mongoose";
import Course, { Icourse } from "@/database/course.model";
import { revalidatePath } from "next/cache";
import Lecture from "@/database/lecture.model";
import { date } from "zod";
import Lesson from "@/database/lesson.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { EcourseStatus } from "@/contants/enums";
import Coupon from "@/database/coupon.model";
import { toast } from "react-toastify";

// fetching all courses
export async function getAllCourses(
  params: EGetAllCourseParams
): Promise<Icourse[] | undefined> {
  try {
    connectToDatabase();
    const { page = 1, limit = 10, search, status } = params;
    const skip = (page - 1) * limit;
    const query: FilterQuery<typeof Course> = {};
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }
    if (status) {
      query.status = status;
    }
    const courses = await Course.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ create_at: -1 });
    const plainCourses = JSON.parse(JSON.stringify(courses));
    return plainCourses;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCoursesInDB(): Promise<Icourse[] | undefined> {
  try {
    connectToDatabase();
    const courses = await Course.find();
    const filterCourse = courses.filter((course) => course._destroy === false);
    // console.log("courses: ", filterCourse);
    const plainCourses = JSON.parse(JSON.stringify(filterCourse));
    return plainCourses;
  } catch (error) {
    console.log(error);
  }
}
// fetching only one course
export async function getCourseBySlug(params: {
  slug: String;
}): Promise<TCreateCourseParams | undefined> {
  const slug = params.slug;
  try {
    await connectToDatabase();
    const findCourse = await Course.findOne({ slug: String(slug) }).populate({
      path: "lectures",
      select: "_id, title",
      model: Lecture,
      match: { _destroy: false },
      populate: {
        path: "lesson",
        select: "_id title duration type video_url content slug course",
        model: Lesson,
        match: { _destroy: false },
      },
    });
    return findCourse.toObject();
  } catch (error) {
    console.log(error);
  }
}
// create
export default async function createCourse(params: TCreateCourse) {
  try {
    connectToDatabase();
    const course = await Course.create(params);
    return { success: true, data: course };
  } catch (error) {
    return { success: false };
  }
}
// update

export async function updateCourse(params: TUpdateCourse) {
  try {
    connectToDatabase();
    const findCourse = await Course.findOne({ slug: params.slug });
    if (!findCourse) return;
    await Course.findOneAndUpdate({ slug: params.slug }, params.updateData, {
      new: true, // trực tiếp tự động cập nhật khóa học, không cần refresh
    });
    revalidatePath(params.path || "/"); // reload lại trang chủ giúp tải dữ liệu mới lên
    return {
      success: true,
      message: "Cập nhật khóa học thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function addCommentToCourse(params: TAddCommentToCourseParams) {
  try {
    connectToDatabase();
    const course = await Course.findOne({ _id: params.courseId });
    if (!course) {
      console.log("Không tìm thấy khóa học");
    }
    const newComment = {
      question: params.question,
      answer: params.answer,
    };
    course.info.qa.push(newComment);
    await course.save();
    return {
      success: true,
      message: "Thêm bình luận thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCommentByIndex(params: {
  courseId: string;
  index: Number;
}) {
  try {
    connectToDatabase();
    const course = await Course.findOne({ _id: params.courseId });
    if (!course) {
      console.log("Không tìm thấy khóa học");
    }
    course.info.qa.splice(params.index, 1);
    await course.save();
    return {
      success: true,
      message: "Xoá bình luận thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateCommentByIndex(params: {
  courseId: string;
  index: number;
  question: string;
  answer: string;
}) {
  try {
    connectToDatabase();
    const course = await Course.findOne({ _id: params.courseId });
    if (!course) {
      console.log("Không tìm thấy khóa học");
    }
    course.info.qa[params.index].question = params.question;
    course.info.qa[params.index].answer = params.answer;
    await course.save();
    return {
      success: true,
      message: "Cập nhật bình luận thành công",
    };
  } catch (error) {
    console.log(error);
  }
}
