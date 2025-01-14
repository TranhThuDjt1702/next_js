"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ECouponStatus,
  ECouponType,
  EcourseStatus,
  EOrderStatus,
} from "@/contants/enums";

import { ICoupon } from "@/database/coupon.model";
import { format } from "date-fns";

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
import Course, { Icourse } from "@/database/course.model";
import { toast } from "react-toastify";
import { couponArrayType, couponStatus } from "@/contants";
import Swal from "sweetalert2";
import {
  IconAdd,
  IconDelete,
  IconEdit,
  IconLeft,
  IconRight,
  IconSearch,
} from "@/components/layout/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SelectGroup } from "@radix-ui/react-select";
import NumberFormat from "react-number-format";
import { set } from "lodash";

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
  course: z.array(z.string()).optional(),
});

const CouponManage = ({
  couponsList,
  courseList,
  limitPage,
}: {
  couponsList: ICoupon[];
  courseList: Icourse[];
  limitPage: number;
}) => {
  const router = useRouter();
  const NumberFormat = require("react-number-format");
  const [timeNow, setTimeNow] = useState(new Date());
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    couponsList.forEach(async (coupon) => {
      const currentTime = new Date();
      const endDate = new Date(coupon.end_date);

      if (currentTime > endDate && coupon.status !== ECouponStatus.INACTIVE) {
        try {
          const res = await updateCoupon({
            code: coupon.code,
            updateData: { status: ECouponStatus.INACTIVE },
          });
          if (res?.success) {
            toast.warn("Khóa học đã hết hạn");
          }
        } catch (error) {
          console.error("Lỗi cập nhật mã giảm giá:", error);
        }
      }
    });
  }, [timeNow, couponsList]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const [isCreate, setisCreate] = useState(false);
  const [isActive, setIsActive] = useState<ECouponStatus | undefined>(
    ECouponStatus.INACTIVE
  );
  const [couponType, setCouponType] = useState<ECouponType | undefined>(
    ECouponType.PERCENT
  );
  const [selectedCourse, setSelectedCourse] = useState<string[]>([]);
  const handleSearchCoupon = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`${pathname}?${createQueryString("search", e.target.value)}`);
  };
  const handleSelectStatus = (status: ECouponStatus) => {
    router.push(`${pathname}?${createQueryString("status", status)}`);
  };
  const handleSelectCouponType = (couponType: ECouponType) => {
    router.push(`${pathname}?${createQueryString("coupon_type", couponType)}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const handleChangePage = (type: "prev" | "next") => {
    if (type === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (type === "next" && currentPage < limitPage) {
      setCurrentPage(currentPage + 1);
    }
    console.log("currentPage: ", currentPage);
  };

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString("page", currentPage.toString())}`
    );
  }, [currentPage]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newCoupon = await createCoupon({
        code: createCouponCode(),
        title: values.title,
        value: values.value,
        status: isActive,
        start_date: values.startdate,
        end_date: values.enddate,
        number: values.number,
        course: selectedCourse,
        coupon_type: couponType,
      });
      if (newCoupon?.success) {
        toast.success(newCoupon.message);
      }
    } catch (error) {
      console.log(error);
    }
    setisCreate(false);
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleChange = async (code: string, status: string) => {
    if (status === EcourseStatus.APPROVED) return;
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn đổi trạng thái mã giảm giá?",
        showCancelButton: true,
        confirmButtonText: "Duyệt",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        if (code) {
          const res = await updateCoupon({
            code,
            updateData: {
              status:
                status === ECouponStatus.ACTIVE
                  ? ECouponStatus.INACTIVE
                  : ECouponStatus.ACTIVE,
            },
          });
          if (res?.success) {
            toast.success(res?.message);
          }
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  const handleDeleteCoupon = async (code: string) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xoá mã giảm giá này?",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        if (code) {
          const res = await deleteCoupon(code);
          if (res?.success) {
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditCoupon = async (code: string) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn sửa mã giảm giá này?",
        showCancelButton: true,
        confirmButtonText: "Sửa",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        if (code) {
          router.push(`/manage/coupon/edit/${code}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-5 flex flex-col">
      {!isCreate ? (
        <div className="mt-5 flex flex-col items-end gap-5">
          <div className="flex gap-3">
            <div className="dark:text-black flex items-center gap-2 lg:mr-2 lg:pr-6 lg:pl-2 mt-5 lg:mt-0 bg-white rounded-xl pl-2 border-none ">
              <IconSearch />
              <input
                className="outline-none rounded-lg p-2 dark:bg-white w-full lg:w-[400px] lg:mt-0"
                placeholder="tìm kiếm khóa học"
                onChange={(e) => handleSearchCoupon(e)}
              ></input>
            </div>
            <Select
              onValueChange={(value) =>
                handleSelectStatus(value as ECouponStatus)
              }
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Trạng thái</SelectLabel>
                  {couponStatus.map((status) => (
                    <SelectItem value={status.value} key={status.value}>
                      {status.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                handleSelectCouponType(value as ECouponType)
              }
            >
              <SelectTrigger className="w-[180px] ">
                <SelectValue placeholder="Chọn loại mã" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Loại mã</SelectLabel>
                  {couponArrayType.map((type) => (
                    <SelectItem value={type.value} key={type.value}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Giá trị của mã</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khóa học áp dụng</TableHead>
              </TableRow>
            </TableHeader>
            {couponsList.map((coupon) => (
              <TableBody key={coupon.code}>
                <TableRow>
                  <TableCell className="font-bold">{coupon.code}</TableCell>
                  <TableCell>{coupon.title}</TableCell>
                  <TableCell>{coupon.number}</TableCell>
                  <TableCell>
                    {coupon.start_date
                      ? format(new Date(coupon.start_date), "dd/MM/yyyy")
                      : "invalid date"}
                  </TableCell>
                  <TableCell>
                    {coupon.end_date
                      ? format(new Date(coupon.end_date), "dd/MM/yyyy")
                      : "invalid date"}
                  </TableCell>
                  <TableCell>
                    {coupon.coupon_type === ECouponType.PERCENT
                      ? `${coupon.value}%`
                      : `${coupon.value} VND`}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleChange(coupon.code, coupon.status)}
                      className={
                        coupon.status === couponStatus[0].value
                          ? couponStatus[0].classname
                          : coupon.status === couponStatus[1].value
                          ? couponStatus[1].classname
                          : couponStatus[2].classname
                      }
                    >
                      {coupon.status === couponStatus[0].value
                        ? couponStatus[0].title
                        : coupon.status === couponStatus[1].value
                        ? couponStatus[1].title
                        : couponStatus[2].title}
                    </button>
                  </TableCell>
                  <TableCell>
                    {
                      <Select>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {coupon.course.map((course, index) => {
                              return (
                                <SelectItem key={index} value={course._id}>
                                  {course.title}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    }
                  </TableCell>
                  <TableCell className="flex flex-col gap-2">
                    <button
                      className="hover:text-red-500  mt-1 rounded-lg"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                    >
                      <IconDelete />
                    </button>
                    <button onClick={() => handleEditCoupon(coupon.code)}>
                      <IconEdit />
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          <Button onClick={() => setisCreate(true)}>Tạo mã giảm giá mới</Button>
          <div className="flex justify-end mt-2 mr-2 gap-2">
            <button
              className="p-2 rounded-lg hover:bg-black hover:text-white transition-all dark:hover:bg-gray-500"
              onClick={() => handleChangePage("prev")}
            >
              <IconLeft />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-black hover:text-white transition-all dark:hover:bg-gray-500"
              onClick={() => handleChangePage("next")}
            >
              <IconRight />
            </button>
          </div>
          <div className="fixed bottom-10 left-[330px] font-bold">
            Page {currentPage} / {limitPage}
          </div>
        </div>
      ) : (
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
                      <FormLabel className="font-bold ">
                        Ngày kết thúc{" "}
                      </FormLabel>
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
                        className="w-[450px] bg -white"
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
                    <div
                      className="flex items-center space-x-2"
                      key={course._id}
                    >
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
      )}
    </div>
  );
};

export default CouponManage;
