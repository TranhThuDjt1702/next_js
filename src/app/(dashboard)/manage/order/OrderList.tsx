"use client";
import Heading from "@/components/common/Heading";
import {
  IconAdd,
  IconDelete,
  IconEdit,
  IconLeft,
  IconRight,
  IconSearch,
} from "@/components/layout/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useCallback, useEffect, useState } from "react";
import { commonCourseClass, orderStatus } from "@/contants";
import { get, set } from "lodash";
import {
  createOrder,
  getAllOrder,
  updateOrderParams,
} from "@/lib/actions/order.action";
import { Iorder } from "@/database/order.model";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EOrderStatus } from "@/contants/enums";
import { stat } from "fs";
import Link from "next/link";
import IconCourse from "@/components/layout/icons/IconCourse";
import Iconeye from "@/components/layout/icons/IconEye";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Coupon from "@/database/coupon.model";
import { Button } from "@/components/ui/button";
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


const formSchema = z.object({
  amount: z.number().int().nonnegative().optional(),
  status: z
    .enum([EOrderStatus.PENDING, EOrderStatus.SUCCESS, EOrderStatus.CANCEL])
    .optional(),
  //   Coupon : z.object({})
});

const OrderList = ({
  orderList,
  limitPage,
}: {
  orderList: {
    code: string;
    amount: number;
    status: string;
    coupon: {
      title: string;
    };
    course: { title: string };
  }[];
  limitPage: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);
  const [newStatus, setNewStatus] = useState<EOrderStatus | undefined>(
    undefined
  );
  const [code, setCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const handleChangeStatus = async (code: string, status: string) => {
    if (status === EOrderStatus.SUCCESS) return;
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn duyệt hóa đơn?",
        showCancelButton: true,
        confirmButtonText: "Duyệt",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        if (code) {
          await updateOrderParams({
            params: {
              code,
              updateData: {
                status:
                  status === orderStatus[0].value
                    ? orderStatus[1].value
                    : orderStatus[0].value,
              },
            },
          });
        }
        toast.success("Duyệt hóa đơn thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const handleSearchOrder = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`${pathname}?${createQueryString("search", e.target.value)}`);
  };
  const handleSelectStatus = (status: EOrderStatus) => {
    router.push(`${pathname}?${createQueryString("status", status)}`);
  };
  const handleDelete = async (code: string) => {
    try {
      if (code) {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn muốn xóa?",
          showCancelButton: true,
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
        });
        if (result.isConfirmed) {
          toast.success("Xóa thành công");
          await updateOrderParams({
            params: {
              code,
              updateData: {
                status: EOrderStatus.CANCEL,
              },
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnEdit = (code: string) => {
    setIsEdit(true);
    setCode(code);
  };
  const handleChangePage = (type: string) => {
    if (type === "prev" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      if (type === "next" && currentPage < limitPage) {
        setCurrentPage(currentPage + 1);
      }
      console.log("currentPage: ", currentPage);
  }
  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString("page", currentPage.toString())}`
    );
  }, [currentPage]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      status: EOrderStatus.PENDING,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await updateOrderParams({
        params: {
          code: code,
          updateData: {
            amount: values.amount,
            status: newStatus,
          },
        },
      });
      if (res?.success) {
        toast.success("Cập nhật thành công");
      }
    } catch (error) {
      console.log(error);
    }
    setIsEdit(false);
  }

  return (
    <div>
      {!isEdit ? (
        <div>
          <div className="flex lg:items-center justify-between mb-10 flex-col lg:flex-row">
            <Heading>Order manage</Heading>
            <div className="flex gap-3">
              <div className="dark:text-black flex items-center gap-2 lg:mr-2 lg:pr-6 lg:pl-2 mt-5 lg:mt-0 bg-white rounded-xl pl-2 border-none ">
                <IconSearch />
                <input
                  className="outline-none rounded-lg p-2 dark:bg-white w-full lg:w-[400px] lg:mt-0"
                  placeholder="Tìm kiếm đơn hàng"
                  onChange={handleSearchOrder}
                ></input>
              </div>
              <Select onValueChange={handleSelectStatus}>
                <SelectTrigger className="w-[180px] outline-none focus:outline-none">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trạng thái</SelectLabel>
                    {orderStatus.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>khóa học</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Mã giảm giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList.length > 0 ? (
                orderList.map((order) => (
                  <TableRow key={order.code}>
                    <TableCell className=" font-bold">{order.code}</TableCell>
                    <TableCell className="font-bold">
                      {order.course.title}
                    </TableCell>
                    <TableCell className="font-bold">{order.amount}</TableCell>
                    <TableCell>{order.coupon?.toString() || ""}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className={
                          order.status === orderStatus[0].value
                            ? orderStatus[0].classname
                            : order.status === orderStatus[1].value
                            ? orderStatus[1].classname
                            : orderStatus[2].classname
                        }
                        onClick={() =>
                          handleChangeStatus(order.code, order.status)
                        }
                      >
                        {order.status === orderStatus[0].value
                          ? orderStatus[0].title
                          : order.status === orderStatus[1].value
                          ? orderStatus[1].title
                          : orderStatus[2].title}
                      </button>
                    </TableCell>
                    <TableCell className="flex gap-3">
                      <button
                        className={commonCourseClass.action}
                        onClick={() => handleOnEdit(order.code)}
                      >
                        <IconEdit />
                      </button>
                      <button
                        className={commonCourseClass.action}
                        onClick={() => handleDelete(order.code)}
                      >
                        <IconDelete />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow >
                  <TableCell
                    colSpan={4}
                    className="text-center font-bold p-5 text-l" 
                  >
                    No order available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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
          <div className="fixed bottom-10 left-[330px] font-bold">Page</div>
        </div>
      ) : (
        <div className="flex gap-2 justify-center bg-white w-96 m-auto p-10 rounded-lg ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chỉnh sửa giá đơn hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập giá tiền"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chỉnh sửa trạng thái</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          setNewStatus(value as EOrderStatus)
                        }
                      >
                        <SelectTrigger className="w-[180px] outline-none focus:outline-none">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Trạng thái</SelectLabel>
                            {orderStatus.map((item, index) => (
                              <SelectItem key={index} value={item.value}>
                                {item.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default OrderList;
