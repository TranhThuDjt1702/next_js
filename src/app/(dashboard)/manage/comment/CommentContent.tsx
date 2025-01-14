"use client";
import React, { use, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Icourse } from "@/database/course.model";
import { set } from "lodash";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  addCommentToCourse,
  deleteCommentByIndex,
  updateCommentByIndex,
} from "@/lib/actions/course.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IconBin, IconEdit } from "@/components/layout/icons";
import Swal from "sweetalert2";
// import { useRouter } from "next/router";
const formSchema = z.object({
  question: z.string().min(2).max(50),
  answer: z.string().min(2).max(50),
});
const CommentContent = ({ courseList }: { courseList: Icourse[] }) => {
  const [commentList, setCommentList] = React.useState<
    { question: string; answer: string }[]
  >([]);
  const [courseId, setCourseId] = React.useState<string>("");
  const [addQuestion, setAddQuestion] = useState(false);
  const [isEdit, setIsEdit] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newComment = {
        question: values.question,
        answer: values.answer,
      };
      const res = await addCommentToCourse({
        courseId,
        question: values.question,
        answer: values.answer,
      });
      if (res) {
        toast.success("Thêm bình luận thành công");
        setCommentList([...commentList, newComment]);
      }
      setAddQuestion(false);
    } catch (error) {
      console.log(error);
    }
  }
  const handleSelectCourse = (value: string) => {
    try {
      const course = courseList.find((course) => course._id === value);
      // console.log(course?.info.qa);
      setCommentList(course?.info.qa || []);
      setCourseId(value);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteComment = async (index: Number) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa bình luận này không?",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });
      if (result.isConfirmed) {
        const res = await deleteCommentByIndex({ courseId, index: index });
        if (res) {
          toast.success("Xóa bình luận thành công");
          setCommentList(commentList.filter((_, i) => i !== index));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitEdit = async() => {
    try {
      if (isEdit !== null) {
        const res =  await updateCommentByIndex({
          courseId,
          index: isEdit,
          question: question,
          answer: answer,
        });
        if(res?.success){
          toast.success("Sửa bình luận thành công");
          const newComment = {
            question: question,
            answer: answer,
          };
          const newCommentList = [...commentList];
          newCommentList[isEdit] = newComment;
          setCommentList(newCommentList);
          setIsEdit(null);
        }
      }
    } catch (error) {
      console.log(error)
    }
  };



  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between pt-4 pl-8 pr-8">
        <span className="font-semibold text-sm">
          Chọn khóa học để hiển thị bình luận :{" "}
        </span>
        <Select onValueChange={(value) => handleSelectCourse(value)}>
          <SelectTrigger className="w-[500px]">
            <SelectValue placeholder="Chọn khóa học" />
          </SelectTrigger>
          <SelectContent>
            {courseList.map((course) => (
              <SelectItem value={course._id} key={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-black w-[50px]">
                STT
              </TableHead>
              <TableHead className="font-bold text-black">Câu hỏi</TableHead>
              <TableHead className="font-bold text-black">
                Câu trả lời
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commentList.length !== 0 ? (
              commentList.map((comment, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="w-[500px]">
                    {isEdit === index ? (
                      <Input
                        defaultValue={comment.question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                    ) : (
                      comment.question
                    )}
                  </TableCell>
                  <TableCell className="w-[500px]">
                    {isEdit === index ? (
                      <Input
                        defaultValue={comment.answer}
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                    ) : (
                      comment.answer
                    )}
                  </TableCell>
                  {isEdit === index ? (
                    <TableCell className="flex gap-2">
                      <Button onClick={() => handleSubmitEdit()}>Save</Button>
                      <Button onClick={() => setIsEdit(null)}>Cancel</Button>
                    </TableCell>
                  ) : (
                    <div className="flex gap-2">
                      <TableCell
                        onClick={() => handleDeleteComment(index)}
                        className="w-[50px] cursor-pointer"
                      >
                        <IconBin />
                      </TableCell>
                      <TableCell
                        onClick={() => setIsEdit(index)}
                        className="w-[80px] cursor-pointer"
                      >
                        <IconEdit />
                      </TableCell>
                    </div>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Không có bình luận nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!addQuestion ? (
        <Button onClick={() => setAddQuestion(true)}>
          Thêm bình luận vào khóa học
        </Button>
      ) : (
        <div className="flex flex-col gap-5 ml-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xl">
                      Question
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập câu hỏi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xl">Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Trả lời câu hỏi" {...field} />
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

export default CommentContent;
