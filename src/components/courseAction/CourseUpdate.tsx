"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { any, number, z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import slugify from "slugify";
import createCourse, { updateCourse } from "@/lib/actions/course.actions";
// import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EcourseLevel, EcourseStatus } from "@/contants/enums";
import { Icourse } from "@/database/course.model";
import { toast } from "react-toastify";
import { IconAdd, IconDelete } from "../layout/icons";
import { useImmer } from "use-immer";
import { UploadButton } from "@/lib/utils/uploadthing";
import { from } from "svix/dist/openapi/rxjsStub";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(10, "điền ít nhất 10 kí tự"),
  slug: z.string().optional(),
  sale_price: z.number().int().nonnegative().optional(),
  price: z.number().int().nonnegative().optional(),
  desc: z.string().optional(),
  image: z.string().optional(),
  views: z.number().int().nonnegative().optional(),
  rating: z.array(z.number().int().nonnegative()).optional(),
  intro_url: z.string().optional(),
  status: z
    .enum([
      EcourseStatus.APPROVED,
      EcourseStatus.PENDING,
      EcourseStatus.REJECTED,
    ])
    .optional(),
  level: z
    .enum([
      EcourseLevel.ADVANCE,
      EcourseLevel.BEGINNER,
      EcourseLevel.INTERMEDIATE,
    ])
    .optional(),
  info: z
    .object({
      requiment: z.array(z.string()),
      benefits: z.array(z.string()),
      qa: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      ),
    })
    .optional(),
});

export default function ({ data }: { data: Icourse }) {
  // console.log("data: ", data);
  const [issubmit, setIsSubmit] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const router = useRouter();
  const [courseinfo, setCourseInfo] = useImmer({
    requiments: data.info.requiment,
    benefits: data.info.benefits,
    qa: data.info.qa,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      sale_price: data.sale_price,
      price: data.price,
      desc: data.desc,
      image: data.image,
      views: data.views,
      rating: data.rating,
      intro_url: data.intro_url,
      status: data.status,
      level: data.level,
      info: {
        requiment: courseinfo.requiments,
        benefits: courseinfo.benefits,
        qa: courseinfo.qa,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmit(true);
    try {
      const updatedRatings = selectedRating
        ? [...(values.rating || []), selectedRating]
        : values.rating;

      const res = await updateCourse({
        slug: data.slug,
        updateData: {
          title: values.title,
          slug: values.slug,
          sale_price: values.sale_price,
          price: values.price,
          intro_url: values.intro_url,
          desc: values.desc,
          image: values.image,
          views: values.views,
          rating: updatedRatings,
          status: values.status,
          level: values.level,
          info: {
            requiment: courseinfo.requiments.filter((req) => req.trim() !== ""),
            benefits: courseinfo.benefits.filter((ben) => ben.trim() !== ""),
            qa: courseinfo.qa.filter(
              (qa) => qa.question.trim() !== "" && qa.answer.trim() !== ""
            ),
          },
        },
      });
      if (values.slug !== data.slug) {
        router.replace(`/manage/course/update/${values.slug}`);
      }
      if (res?.success) {
        toast.success(res .message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsSubmit(false);
      }, 500);
      form.reset(values);
    }
  }
  const imageWatch = form.watch("image");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-10 mt-10 mb-10 w-full p-3">
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
          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá đã giảm</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="khoa-hoc-lap-trinh"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá gốc</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="khoa-hoc-lap-trinh"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Input className="" placeholder="Mô tả khóa học" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh khóa học</FormLabel>
                <FormControl>
                  <div className="h-[200px] bg-gray-300 rounded-lg border border-gray-200 flex items-center justify-center text-black relative ">
                    {!imageWatch ? (
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          form.setValue("image", res[0].url);
                        }}
                        onUploadError={(error: Error) => {
                          console.error(`ERROR! ${error.message}`);
                        }}
                      />
                    ) : (
                      <Image
                        src={imageWatch}
                        fill
                        alt=""
                        className="h-full w-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="views"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lượt xem</FormLabel>
                <FormControl>
                  <Input
                    placeholder="khoa-hoc-lap-trinh"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Lượt đánh giá</FormLabel>
                <FormControl>
                  <select
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= 5) {
                        setSelectedRating(value);
                      }
                    }}
                    className="h-10 rounded-lg text-sm"
                    value={selectedRating ?? ""}
                  >
                    <option className="pl-2" value="">
                      Chọn đánh giá
                    </option>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intro_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đường dẫn URL</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập đường dẫn URL" {...field} />
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
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái của khóa học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EcourseStatus.APPROVED}>
                      Đã duyệt
                    </SelectItem>
                    <SelectItem value={EcourseStatus.PENDING}>
                      Đang chờ duyệt
                    </SelectItem>
                    <SelectItem value={EcourseStatus.REJECTED}>
                      Từ chối
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trình độ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trình độ hiện tại của bạn" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={EcourseLevel.BEGINNER}>Dễ</SelectItem>
                    <SelectItem value={EcourseLevel.ADVANCE}>
                      Trung bình
                    </SelectItem>
                    <SelectItem value={EcourseLevel.INTERMEDIATE}>
                      Khó
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="info.requiment"
            render={({ field }) => {
              const requiments = field.value as string[];
              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <span>Yêu cầu</span>
                    <button
                      className="hover:text-purple-600"
                      onClick={() => {
                        setCourseInfo((draft) => {
                          draft.requiments.push("");
                        });
                      }}
                      type="button"
                    >
                      <IconAdd />
                    </button>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {courseinfo.requiments.map((r, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Yêu cầu số ${index + 1}`}
                            value={r}
                            onChange={(e) => {
                              setCourseInfo((draft) => {
                                draft.requiments[index] = e.target.value;
                              });
                            }}
                          />
                          <button
                            className="bg-none hover:text-purple-500"
                            onClick={(e) => {
                              if (e.target) {
                                setCourseInfo((draft) => {
                                  draft.requiments[index] = "";
                                });
                              }
                            }}
                            type="button"
                          >
                            <IconDelete />
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="info.benefits"
            render={({ field }) => {
              const benefits = field.value as string[];
              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <span>Lợi ích</span>
                    <button
                      className="hover:text-purple-600"
                      onClick={() => {
                        setCourseInfo((draft) => {
                          draft.benefits.push("");
                        });
                      }}
                      type="button"
                    >
                      <IconAdd />
                    </button>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {courseinfo.benefits.map((r, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            key={index}
                            placeholder={` Lợi ích số ${index + 1}`}
                            value={r}
                            onChange={(e) => {
                              setCourseInfo((draft) => {
                                draft.benefits[index] = e.target.value;
                              });
                            }}
                          />
                          <button
                            className="bg-none hover:text-purple-500"
                            onClick={(e) => {
                              if (e.target) {
                                setCourseInfo((draft) => {
                                  draft.benefits[index] = "";
                                });
                              }
                            }}
                            type="button"
                          >
                            <IconDelete />
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="info.qa"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <span>Q&A</span>
                    <button
                      className="hover:text-purple-600"
                      onClick={() => {
                        setCourseInfo((draft) => {
                          draft.qa.push({
                            question: "",
                            answer: "",
                          });
                        });
                      }}
                      type="button"
                    >
                      <IconAdd />
                    </button>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {courseinfo.qa.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={` Câu hỏi số ${index + 1}`}
                            value={item.question}
                            onChange={(e) => {
                              setCourseInfo((draft) => {
                                draft.qa[index].question = e.target.value;
                              });
                            }}
                          />
                          <Input
                            placeholder={` Câu trả lời số ${index + 1}`}
                            value={item.answer}
                            onChange={(e) => {
                              setCourseInfo((draft) => {
                                draft.qa[index].answer = e.target.value;
                              });
                            }}
                          />
                          <button
                            onClick={(e) => {
                              setCourseInfo((draft) => {
                                (draft.qa[index].question = ""),
                                  (draft.qa[index].answer = "");
                              });
                            }}
                          >
                            <IconDelete />
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <Button
          isLoading={issubmit}
          variant="primary"
          type="submit"
          disabled={issubmit}
          className="w-[120px] ml-3 w-fit"
        >
          Cập nhật khóa học
        </Button>
      </form>
    </Form>
  );
}
