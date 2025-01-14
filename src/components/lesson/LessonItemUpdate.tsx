import { ILecture } from "@/database/lecture.model";
import { ILesson } from "@/database/lesson.model";
import React from "react";
import { Button } from "@/components/ui/button";
import { Editor } from "@tinymce/tinymce-react";
import { htmlToText } from "html-to-text";
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
import { EcourseLevel, EcourseStatus } from "@/contants/enums";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { title } from "process";
import { Content } from "@radix-ui/react-accordion";
import { Duration } from "svix";
import Link from "next/link";
import { updateLesson } from "@/lib/actions/lesson.action";
import { toast } from "react-toastify";

const formSchema = z.object({
  slug: z.string().optional(),
  content: z.string().optional(),
  video_url: z.string().optional(),
  duration: z.number().min(0).optional(),
});

const LessonItemUpdate = ({ lesson }: { lesson: ILesson }) => {
  console.log("lesson: ", lesson);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: lesson.slug,
      content: lesson.content,
      video_url: lesson.video_url,
      duration: lesson.duration,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const plainTextContent = htmlToText(values.content || "", {
        wordwrap: 130,
      });
      const res = await updateLesson({
        course: lesson.course.toString(),
        lessonId: lesson._id,
        updateData: {
          ...values,
          content: plainTextContent,
        },
      });
      if (res?.success) {
        toast.success("Cập nhật bài học thành công");
        console.log("res: ", res);
      }
      console.log("values: ", values);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Đường dẫn khóa học
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="bai-1-tong-quan" {...field} />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Thời lượng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="bai-1-tong-quan"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Video URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youtube.com/watch?v=1"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <div></div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="col-start-1 col-end-3">
                  <FormLabel className="font-bold">Content</FormLabel>
                  <FormControl>
                    <Editor
                      apiKey="v31frbzl6ztvl46z6d1yx285u8t1r9kig1os4r0j5wep55xf"
                      init={{
                        plugins: [
                          // Core editing features
                          "anchor",
                          "autolink",
                          "charmap",
                          "codesample",
                          "emoticons",
                          "image",
                          "link",
                          "lists",
                          "media",
                          "searchreplace",
                          "table",
                          "visualblocks",
                          "wordcount",
                          // Your account includes a free trial of TinyMCE premium features
                          // Try the most popular premium features until Dec 8, 2024:
                          "checklist",
                          "mediaembed",
                          "casechange",
                          "export",
                          "formatpainter",
                          "pageembed",
                          "a11ychecker",
                          "tinymcespellchecker",
                          "permanentpen",
                          "powerpaste",
                          "advtable",
                          "advcode",
                          "editimage",
                          "advtemplate",
                          "mentions",
                          "tinycomments",
                          "tableofcontents",
                          "footnotes",
                          "mergetags",
                          "autocorrect",
                          "typography",
                          "inlinecss",
                          "markdown",
                          // Early access to document converters
                          "importword",
                          "exportword",
                          "exportpdf",
                        ],
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                          tinycomments_mode: "embedded", // Yêu cầu cấu hình chế độ
                          tinycomments_author: "Admin", // Thêm thông tin tác giả
                      }}
                      // initialValue="Welcome to TinyMCE!"
                      value={field.value}
                      onEditorChange={(content) => field.onChange(content)}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </div>
          <div className="flex items-center justify-end gap-4 p-2">
            <Button type="submit" className="hover:bg-gray-600">
              Cập nhật
            </Button>
            <Link className="hover:text-purple-700" href="/">
              Xem trước
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LessonItemUpdate;
