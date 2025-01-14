"use client";
import { orderStatus } from "@/contants";
import { EOrderStatus } from "@/contants/enums";
import { ICoupon } from "@/database/coupon.model";
import { Iorder } from "@/database/order.model";
import { IUser } from "@/database/user.model";
import {
  addCourseToUser,
  getAllUser,
  getUserInfo,
} from "@/lib/actions/user.actions";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { set } from "lodash";
import { toast } from "react-toastify";
import { updateCoupon } from "@/lib/actions/coupon.action";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const PaymentManage = ({
  order,
  userInfo,
  allCoupon,
}: {
  order: Iorder;
  userInfo: IUser;
  allCoupon: ICoupon[];
}) => {
  const [selectedCoupon, setSelectedCoupon] = React.useState<string | null>(
    null
  );
  const [checkCoupon, setCheckCoupon] = React.useState<boolean>(true);
  const coupon = allCoupon.find((coupon) => coupon.code === selectedCoupon);
  // const [checkCoupon, setCheckCoupon] = React.useState<boolean>(false);
  const [finalTotal, setFinalTotal] = React.useState<number>(0);
  const router = useRouter();
  useEffect(() => {
    const courseApply = coupon?.course.map((course) => course._id);
    if (courseApply?.includes(order.course._id)) {
      setCheckCoupon(true);
      if (coupon?.coupon_type === "AMOUNT") {
        const total = order.total - (coupon?.value ?? 0);
        {
          total < 0 ? setFinalTotal(0) : setFinalTotal(total);
        }
      } else {
        setCheckCoupon(false);
        const total = order.total - order.total * (coupon?.value || 0);
        setFinalTotal(total);
      }
      toast.success("Mã giảm giá hợp lệ");
    } else if (selectedCoupon) {
      toast.error("Mã giảm giá không hợp lệ");
    }
    router.push(`/order/${order.code}/payment`);
  }, [selectedCoupon]);
  const handleSubmitBtn = async () => {
    if (checkCoupon) {
      toast.success("Thanh toán thành công");
      router.push(`/order/${order.code}/payment/success`);
    }
  };

  return (
    <div className="grid lg:grid-cols-[2fr,1fr] gap-10 h-full pl-5 dark:bg-black mb-20">
      <div className="mt-10 bg-white p-5 rounded-lg">
        <span className="font-bold text-xl">Thông tin khách hàng</span>
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex flex-col gap-2">
            <span className="font-bold">Họ tên :</span>
            <span>{userInfo.name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold">Email :</span>
            <span>{userInfo.email_address}</span>
          </div>
        </div>
      </div>
      <div className="mt-10 bg-white p-5 rounded-lg">
        <span className="font-bold text-xl">Thông tin đơn hàng</span>
        <div className="flex flex-col gap-5 mt-5">
          <div className="flex flex-col gap-2">
            <span className="font-bold">Mã đơn hàng :</span>
            <span>{order.code}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold">Tổng tiền :</span>
            <span>{finalTotal}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold">Trạng thái :</span>
            <span
              className={
                order.status === orderStatus[0].value
                  ? orderStatus[0].classname
                  : order.status === orderStatus[1].value
                  ? orderStatus[1].classname
                  : orderStatus[2].classname
              }
            >
              {order.status === orderStatus[0].value
                ? orderStatus[0].title
                : order.status === orderStatus[1].value
                ? orderStatus[1].title
                : orderStatus[2].title}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-10 bg-white p-5 rounded-lg">
        <span className="font-bold text-xl">
          Thanh toán qua mã thông tin tài khoản sau
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Tên ngân hàng :</span>
          <span>Ngân hàng MB bank</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Số tài khoản :</span>
          <span>0903536212</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Chủ tài khoản :</span>
          <span>Nguyễn Hà</span>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-10 bg-white p-5 rounded-lg">
        <Select onValueChange={(value) => setSelectedCoupon(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn mã giảm giá" />
          </SelectTrigger>
          <SelectContent>
            {allCoupon.map((coupon) => (
              <SelectItem key={coupon.code} value={coupon.code}>
                {coupon.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button className="mb-10" onClick={() => handleSubmitBtn()}>
        <span>Thanh toán</span>
      </Button>
    </div>
  );
};

export default PaymentManage;
