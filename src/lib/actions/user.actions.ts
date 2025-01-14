"user server";

import User, { IUser } from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  TCreateUserParams,
  TUpdateCourse,
  TUpdateCourseToUserParams,
} from "@/app/types/index.d";
import Course, { Icourse } from "@/database/course.model";
import { deflate } from "zlib";
import { find } from "lodash";

export async function createUser(
  params: TCreateUserParams
): Promise<TCreateUserParams | undefined> {
  try {
    // console.log("params: ", params);
    await connectToDatabase();
    const newUser: TCreateUserParams = await User.create(params);
    return newUser;
  } catch (error) {
    console.log("Error creating user:", error);
  }
}

export async function getUserInfo({
  userId,
}: {
  userId: string;
}): Promise<IUser | undefined | null> {
  try {
    connectToDatabase();
    const findUser = await User.findOne({ clerkId: userId });
    if (!findUser) {
      return null;
    }
    return findUser;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserByClerkId({ clerkId }: { clerkId: string }) {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserCourses(): Promise<Icourse[] | []> {
  try {
    await connectToDatabase();
    const findUsers = await User.find().populate({
      path: "courses",
      model: Course,
      match: { _destroy: false },
    });
    if (!findUsers || findUsers.length === 0) {
      return [];
    }
    const user = findUsers[0];
    const courses = user.courses;
    return courses;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAllUser(): Promise<IUser[] | []> {
  try {
    await connectToDatabase();
    const users = await User.find();

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addCourseToUser(params: TUpdateCourseToUserParams) {
  try {
    connectToDatabase();

    const user = await User.find();
    const userUpdate = user[0];

    const course = await Course.findOne({ _id: params.courseId });
    if (!course) {
      return { success: false, message: "Course not found" };
    }

    if (userUpdate.courses.includes(course._id)) {
      return { success: false, message: "Course already added" };
    }

    userUpdate.courses.push(course._id);

    await userUpdate.save();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "An error occurred" };
  }
}
