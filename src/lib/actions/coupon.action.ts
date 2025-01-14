"use server";

import { connectToDatabase } from "../mongoose";
import History, { IHistory } from "../../database/history.model";
import {
  EGetAllCouponParams,
  TCreateCouponParams,
  TCreateHistoryParams,
  TUpdateCouponParams,
} from "@/app/types/index.d";
import Coupon, { ICoupon } from "@/database/coupon.model";
import path from "path";
import mongoose, { FilterQuery, model } from "mongoose";
import Course from "@/database/course.model";
import { revalidatePath } from "next/cache";
import Order from "@/database/order.model";
export async function createCoupon(params: TCreateCouponParams) {
  try {
    connectToDatabase();
    const newCoupon = await Coupon.create({
      code: params.code,
      title: params.title,
      value: params.value,
      status: params.status,
      coupon_type: params.coupon_type,
      number: params.number,
      start_date: params.start_date,
      end_date: params.end_date,
      course : params.course,
    });
    await newCoupon.save();
    revalidatePath("/manage/coupon");
    return {
      success: true,
      message: "Tạo coupon thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCoupon(
  params: EGetAllCouponParams
): Promise<ICoupon[] | undefined> {
  try {
    connectToDatabase();
    const { page = 1, limit = 5, search, status, coupon_type } = params;
    const skip = (page - 1) * limit;

    const query: FilterQuery<typeof Coupon> = {};
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }
    if (status) {
      query.status = status;
    }
    if (coupon_type) {
      query.coupon_type = coupon_type;
    }
    // console.log("query: ", query);

    const coupons = await Coupon.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ create_at: -1 })
      .populate({
        path: "course",
        model: Course,
        select: "title",
      })
      .lean();
    const plainCoupons = JSON.parse(JSON.stringify(coupons));
    return plainCoupons;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCouponInDB(): Promise<ICoupon[] | undefined> {
  try {
    connectToDatabase();
    const coupons = await Coupon.find().populate({
      path: "course",
      model: Course,
      select: "title",
    });
    const plainCoupons = JSON.parse(JSON.stringify(coupons));
    return plainCoupons;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCoupon(params: TUpdateCouponParams) {
  try {
    connectToDatabase();
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { code: params.code },
      params.updateData,
      {
        new: true,
      }
    );
    if (!updatedCoupon)
      return { success: false, message: "Không tìm thấy coupon" };
    revalidatePath("/manage/coupon");
    return {
      success: true,
      message: "Cập nhật coupon thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCoupon(code: string) {
  try {
    connectToDatabase();
    const res = await Coupon.findOneAndDelete({ code });
    revalidatePath("/manage/coupon");
    if (!res) return { success: false, message: "Không tìm thấy coupon" };
    return {
      success: true,
      message: "Xóa coupon thành công",
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getCouponByCode(params: { code: string }):Promise<ICoupon | undefined> {
  try {
    connectToDatabase();
    const coupon = await Coupon.findOne({ code: params.code }).populate({
      path: "course",
      model: Course,
      select: "title",
    });
    return JSON.parse(JSON.stringify(coupon));
  } catch (error) {
    console.log(error);
  }
}

