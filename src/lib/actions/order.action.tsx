"use server";

import Order, { Iorder } from "@/database/order.model";
import { promises } from "dns";
import { connectToDatabase } from "../mongoose";
import { EGetAllCourseParams, EGetAllOrderParams, TCreateOrderParams, TUpdateOrderParams } from "@/app/types/index.d";
import Course from "@/database/course.model";
import Coupon from "@/database/coupon.model";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

export async function createOrder(params: TCreateOrderParams) {
  try {
    await connectToDatabase();
    const newOrder = await Order.create(params);
    if (!newOrder) return { success: false, message: "Tạo order thất bại" };
    return { success: true, message: "Tạo order thành công" };
  } catch (error) {
    console.log(error);
  }
}

export async function getAllOrder(params: EGetAllOrderParams): Promise<Iorder[] | undefined> {
  try {
    await connectToDatabase();
    const { page = 1, limit = 10, search, status } = params;
    const skip = (page - 1) * limit;
    const query: FilterQuery<typeof Order> = {};
    if(search){
        query.$or = [{code: { $regex: search, $options: "i" }}];
      }
      if (status) {
        query.status = status;
      }
    const orders = await Order.find(query).skip(skip).limit(limit).sort({ create_at: -1 }).populate({
        path: "course",
        select: "title",
        model: Course,
    });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateOrderParams({
  params,
}: {
  params: TUpdateOrderParams;
}) {
  try {
    connectToDatabase();
    const findOrder = await Order.findOne({ code: params.code });
    if (!findOrder) return { success: false, message: "Không tìm thấy order" };
    await Order.findOneAndUpdate({ code: params.code }, params.updateData, {
      new: true,
    });
    revalidatePath("/manage/order");
    return { success: true, message: "Cập nhật order thành công" };
  } catch (error) {
    console.log(error);
  }
}

export async function getOrderDetail(code: string) {
  try {
    connectToDatabase()
    if(!code) return;
    const orderDetail = await Order.findOne({ code }).populate({
      path: "course",
      model : Course,
      select: "title"
    })
    return JSON.parse(JSON.stringify(orderDetail));
  } catch (error) {
    console.log(error);
  }
}
