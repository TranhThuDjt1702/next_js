"use client";
import { Button } from "@/components/ui/button";
import { Icourse } from "@/database/course.model";
import { createOrder } from "@/lib/actions/order.action";
import { createOrderCode } from "@/lib/utils/index";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "react-toastify";

const ButtonNavigate = ({
  children,
  userCourseLength,
  courseId,
  amount,
}: {
  children: React.ReactNode;
  userCourseLength: Number;
  courseId: string;
  amount: number;
}) => {
  const router = useRouter();
  const handleBuyBtn = async () => {
    // if (userCourseLength === 0) {
    //   toast.error("Bạn chưa mua khóa học nào");
    //   return;
    // }
    const code = createOrderCode();
    const order = await createOrder({
      code: code,
      course: courseId,
      amount: amount,
      total: amount,
    });
    if (order?.success) {
      toast.success("Đặt hàng thành công");
      router.push(`/order/${code}`);
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };
  return (
    <Button
      className="bg-purple-500 mt-4 w-full hover:bg-purple-400"
      onClick={() => handleBuyBtn()}
    >
      {children}
    </Button>
  );
};

export default ButtonNavigate;
