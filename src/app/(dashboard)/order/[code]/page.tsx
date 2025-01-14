'use server'
import Heading from "@/components/common/Heading";
import { Header } from "@radix-ui/react-accordion";
import React from "react";
import OrderDetail from "../OrderDetail";
import { getOrderDetail } from "@/lib/actions/order.action";
import { Button } from "@/components/ui/button";
import PayButton from "./PayButton";

const page = async ({
  params,
}: {
  params: {
    code: string;
  };
}) => {
  const orderDetail = await getOrderDetail(params.code);
  // console.log(orderDetail);
  
  return (
    <div className="flex flex-col gap-5 pl-5">
      <p>
        Bạn đã chọn khóa học{" "} <strong className="text-purple-700">{orderDetail.course.title}</strong> {" "}
        với giá <strong className="text-purple-700">{orderDetail.amount}</strong>
      </p>
      <p className="flex flex-col  gap-2">
        Mã đơn hàng của bạn là: <strong className="text-purple-700">{orderDetail.code}</strong> {" "}
        Bạn vui lòng thanh toán hóa đơn để hoàn tất quá trình mua hàng
      </p>
      <PayButton orderDetail = {orderDetail}/>
    </div>
  );
};

export default page;
