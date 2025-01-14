"use client";
import { Button } from "@/components/ui/button";
import {
  ECouponStatus,
  ECouponType,
  EcourseStatus,
  EOrderStatus,
} from "@/contants/enums";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  updateCoupon,
} from "@/lib/actions/coupon.action";
import { useState } from "react";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
// import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCouponCode } from "@/lib/utils/index";
import { Icourse } from "@/database/course.model";
import { toast } from "react-toastify";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ICoupon } from "@/database/coupon.model";
const formSchema = z.object({
  title: z
    .string({
      message: "Tiêu đề không được để trống",
    })
    .min(10, "tiêu đề ít nhất 10 kí tự")
    .optional(),
  status: z.enum([ECouponStatus.ACTIVE, ECouponStatus.INACTIVE]).optional(),
  startdate: z.date().optional(),
  enddate: z.date().optional(),
  number: z.number().int().nonnegative().optional(),
  coupontype: z.enum([ECouponType.PERCENT, ECouponType.AMOUNT]).optional(),
  value: z.number().int().nonnegative().optional(),
  course: z.string().optional(),
});

const CouponEditForm = ({
  param,
  courseList,
  coupon,
}: {
  coupon: ICoupon;
  param: {
    code: string;
  };
  courseList: Icourse[];
}) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState<ECouponStatus | undefined>(
    ECouponStatus.INACTIVE
  );
  const [couponType, setCouponType] = useState<ECouponType | undefined>(
    ECouponType.PERCENT
  );
  const [selectedCourse, setSelectedCourse] = useState<string[]>([]);
  const code = param.code;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await updateCoupon({
        code: code,
        updateData: {
          title: values.title,
          status: isActive,
          start_date: values.startdate,
          end_date: values.enddate,
          number: values.number,
          coupon_type: couponType,
          value: values.value,
          course: selectedCourse,
        },
      });
      if (res?.success) {
        toast.success(res.message);
      }
      router.push("/manage/coupon");
    } catch (error) {
      console.log(error);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: coupon.title,
      status: coupon.status,
      startdate: coupon.start_date,
      enddate: coupon.end_date,
      number: coupon.number,
      coupontype: coupon.coupon_type,
      value: coupon.value,
      course: coupon.course.toString(),
    },
  });

  return (
    <div>
      <div className="ml-2 mr-2 gap-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap gap-2 justify-around "
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="p-5">
                  <FormLabel className="font-bold">Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[450px] bg-white"
                      placeholder="Nhập tiêu đề"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 m-5">
              <span className="font-bold text-xs">Trạng thái</span>
              <Select
                onValueChange={(value) => setIsActive(value as ECouponStatus)}
              >
                <SelectTrigger className="w-[450px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Duyệt</SelectItem>
                  <SelectItem value="INACTIVE">Chưa duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex">
              <FormField
                control={form.control}
                name="startdate"
                render={({ field }) => (
                  <FormItem className="p-5">
                    <FormLabel className="font-bold ">Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-[200px] bg-white"
                        placeholder="Ngày bắt đầu"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : new Date(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enddate"
                render={({ field }) => (
                  <FormItem className="p-5">
                    <FormLabel className="font-bold ">Ngày kết thúc </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="w-[200px] bg-white"
                        placeholder="Nhập ngày kết thúc"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : new Date(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="p-5">
                  <FormLabel className="font-bold">Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[450px] bg-white"
                      placeholder="Nhập số lượng mã giảm giá muốn tạo"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 m-5 w-[450px]">
              <span className="font-bold text-xs">Loại mã giảm giá</span>
              <Select
                onValueChange={(value) => setCouponType(value as ECouponType)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Chọn loại mã" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENT">Phần trăm</SelectItem>
                  <SelectItem value="AMOUNT">Giá tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="p-5">
                  <FormLabel className="font-bold">Giá trị</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center gap-2">
                      <Input
                        className="w-[450px] bg-white"
                        placeholder="Nhập giá trị của mã"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                          if (
                            couponType === ECouponType.PERCENT &&
                            Number(value) > 100
                          ) {
                            toast.error(
                              "Giá trị không được vượt quá 100 cho mã phần trăm"
                            );
                            field.onChange(100);
                            return;
                          }
                        }}
                      />
                      <span className="bg-white h-10 rounded-lg font-bold w-fit flex items-center pl-2 pr-2 text-sm">
                        {couponType === ECouponType.PERCENT ? "%" : "VND"}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-start gap-2 m-5 w-[450px]">
              <span className="font-bold text-xs">Chọn khóa học</span>
              <div className="flex flex-col gap-2 items-start justify-center space-x-2">
                {courseList.map((course) => (
                  <div className="flex items-center space-x-2" key={course._id}>
                    <input
                      type="checkbox"
                      className="cursor-pointer size-4 rounded-3xl"
                      id={`course-checkbox-${course._id}`} // Thêm id cho input để liên kết với label
                      value={course._id}
                      checked={selectedCourse.includes(course._id)} // Kiểm tra checkbox đã được chọn chưa
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCourse((prevSelectedCourse) => [
                            ...prevSelectedCourse,
                            course._id,
                          ]);
                        } else {
                          setSelectedCourse((prevSelectedCourse) =>
                            prevSelectedCourse.filter(
                              (courseId) => courseId !== course._id
                            )
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`course-checkbox-${course._id}`}
                      className="cursor-pointer"
                    >
                      {course.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <Button
                className="mr-20 w-[129px] h-[40px] fixed bottom-5 ml-10"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CouponEditForm;
