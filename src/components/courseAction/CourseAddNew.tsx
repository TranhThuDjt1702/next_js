"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import slugify from 'slugify' 
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
import { useState } from "react";
// import slugify from "slugify";
import createCourse, { updateCourse } from "@/lib/actions/course.actions";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
import { EcourseLevel, EcourseStatus } from "@/contants/enums";
import { Icourse } from "@/database/course.model";
import { title } from "process";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const formSchema = z.object({
  title: z.string().min(10, "điền ít nhất 10 kí tự"),
  slug: z.string(),
});

export default function CourseAddNew() {
  const router =  useRouter()
  const [issubmit, setIsSubmit] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log("data : ",data)
    setIsSubmit(true);
    try {
      const data = {
        title : values.title,
        slug: values.slug ||
        slugify(values.title, {
          lower : true,
          locale : 'vi'
        })
      }
     const res= await createCourse(data)
     if(res?.success){
      toast.success("tạo khóa học thành công")
     }
     if(res?.data){
      router.push(`/manage/course/update/${res.data.slug}`)
     }
    } catch (error) {
      console.log(error)
    }
     finally {
      setTimeout(() => {
        setIsSubmit(false);
      }, 500);
      form.reset();
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-10 mt-10 mb-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CourseName *</FormLabel>
                <FormControl>
                  <Input placeholder="enter the course" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đường dẫn khóa học</FormLabel>
                <FormControl>
                  <Input placeholder="khoa-hoc-lap-trinh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          isLoading={issubmit}
          variant="primary"
          type="submit"
          disabled={issubmit}
          className="w-[120px]"
        >
          Tạo khóa học
        </Button>
      </form>
    </Form>
  );
}
