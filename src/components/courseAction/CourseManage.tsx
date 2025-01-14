"use client";
import React, { use, useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Heading from "../common/Heading";
import Image from "next/image";
import { getAllCourses, updateCourse } from "@/lib/actions/course.actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { commonCourseClass, courseStatus } from "@/contants";
import {
  IconAdd,
  IconDelete,
  IconEdit,
  IconLeft,
  IconRight,
  IconSearch,
} from "../layout/icons";
import Iconeye from "../layout/icons/IconEye";
import Link from "next/link";
import IconCourse from "../layout/icons/IconCourse";
import { Icourse } from "@/database/course.model";
import Swal from "sweetalert2";
import { EcourseStatus } from "@/contants/enums";
import { toast } from "react-toastify";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce, set } from "lodash";
import { stat } from "fs";

const CourseManage = ({
  courses,
  limitPage,
}: {
  courses: Icourse[];
  limitPage: number;
}) => {
  // console.log("courses: ", courses);
  const handleChange = async (slug: string, status: string) => {
    if (status === EcourseStatus.APPROVED) return;
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn duyệt khóa học?",
        showCancelButton: true,
        confirmButtonText: "Duyệt",
        cancelButtonText: "Hủy",
      });
      
      if (result.isConfirmed) {
        if (slug) {
          await updateCourse({
            slug,
            updateData: {
              status:
                status === EcourseStatus.PENDING
                  ? EcourseStatus.APPROVED
                  : EcourseStatus.APPROVED,
              _destroy: false,
            },
            path: "/manage/course",
          });
          toast.success("Cập nhật khóa học thành công");
        }
        // console.log("Người dùng nhấn Duyệt");
      } else {
        // console.log("Người dùng nhấn Hủy");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleDelete = (slug: string) => {
    const currentcourse =  courses.find((course:Icourse) => course.slug === slug);
    if(currentcourse?.status === EcourseStatus.PENDING) return
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (slug) {
        await updateCourse({
          slug,
          updateData: {
            status: EcourseStatus.PENDING,
            _destroy: true,
          },
          path: "/manage/course",
        });
        toast.success("Xóa khóa học thành công");
      }
    });
  };
  const router = useRouter();
  const handleAdd = () => {
    router.push("/manage/course/new");
  };

  const searchParams = useSearchParams();

  const handleSearchCourse = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`${pathname}?${createQueryString("search", e.target.value)}`);
  };

  const handleSelectStatus = (status: EcourseStatus) => {
    router.push(`${pathname}?${createQueryString("status", status)}`);
  };
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

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

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString("page", currentPage.toString())}`
    );
  }, [currentPage]);

  return (
    <div>
      <div className="flex lg:items-center justify-between mb-10 flex-col lg:flex-row">
        <Heading>Course manage</Heading>
        <div className="flex gap-3">
          <div className="dark:text-black flex items-center gap-2 lg:mr-2 lg:pr-6 lg:pl-2 mt-5 lg:mt-0 bg-white rounded-xl pl-2 border-none ">
            <IconSearch />
            <input
              className="outline-none rounded-lg p-2 dark:bg-white w-full lg:w-[400px] lg:mt-0"
              placeholder="tìm kiếm khóa học"
              onChange={(e) => handleSearchCourse(e)}
            ></input>
          </div>
          <Select
            onValueChange={(value) =>
              handleSelectStatus(value as EcourseStatus)
            }
          >
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trạng thái</SelectLabel>
                {courseStatus.map((status) => (
                  <SelectItem value={status.value} key={status.value}>
                    {status.title}
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
            <TableHead>Thông tin</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="pl-6">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course:Icourse) => (
              <TableRow key={course.slug}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        course.image
                          ? course.image
                          : "https://i.pinimg.com/736x/a4/52/ea/a452eae371f079b141494c5aff07a140.jpg"
                      }
                      alt="no image available"
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex items-start flex-col gap-2 pl-2 ">
                      <div>
                        <h3 className=" text-purple-600 dark:text-purple-300 font-bold">
                          {course.title}
                        </h3>
                      </div>
                      <div>
                        <h4 className="text-purple-600 dark:text-purple-300 font-bold">
                          {course.create_at.slice(0, 10)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-bold">{course.price}</TableCell>
                <TableCell>
                  <button 
                    type="button"
                    onClick={() => handleChange(course.slug, course.status)}
                    className={
                      course.status === courseStatus[0].value
                        ? courseStatus[0].classname
                        : course.status === courseStatus[1].value
                        ? courseStatus[1].classname
                        : courseStatus[2].classname
                    }
                  >
                    {course.status === courseStatus[0].value
                      ? courseStatus[0].title
                      : course.status === courseStatus[1].value
                      ? courseStatus[1].title
                      : courseStatus[2].title}
                  </button>
                </TableCell>
                <TableCell className="flex gap-2 items-center mt-2">
                  <Link
                    href={`/manage/course/update-content/${course.slug}`}
                    className={commonCourseClass.action}
                    target="_blank"
                  >
                    <IconCourse />
                  </Link>
                  <Link
                    href={`/course/${course.slug}`}
                    target="_blank"
                    className={commonCourseClass.action}
                  >
                    <Iconeye />
                  </Link>
                  <Link
                    href={`/manage/course/update/${course.slug}`}
                    className={commonCourseClass.action}
                  >
                    <IconEdit />
                  </Link>
                  <button
                    className={commonCourseClass.action}
                    onClick={() => handleDelete(course.slug)}
                  >
                    <IconDelete />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center font-bold p-5 text-l"
              >
                No courses available
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
        <button
          className="ml-6 hover:text-white hover:bg-black rounded-lg pl-5 pr-5"
          onClick={() => handleAdd()}
        >
          <IconAdd className="size-8 " />
        </button>
      </div>
      <div className="fixed bottom-10 left-[330px] font-bold">
        Page {currentPage} / {limitPage}
      </div>
    </div>
  );
};

export default CourseManage;
