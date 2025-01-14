import { ECouponStatus, ECouponType, EcourseStatus, EOrderStatus } from "@/contants/enums";
import { ICoupon } from "@/database/coupon.model";
import { Icourse } from "@/database/course.model";
import { ILecture } from "@/database/lecture.model";
import { ILesson } from "@/database/lesson.model";
import { Iorder } from "@/database/order.model";
import { number } from "zod";

export interface IActiveLinkProps {
  url: string;
  children: React.ReactNode;
}

export interface IMenuItem {
  url: string;
  title: string;
  icon: React.ReactNode;
  onlyIcon?: boolean;
}

export type TCreateUserParams = {
  clerkId?: string;
  userName: string;
  email: string;
  name?: string;
  avatar?: string;
};

export type TUpdateCourseToUserParams = {
  courseId : String; 
}

export type TUpdateLessonParams = {
  _id: string;
  title: string;
  lesson: ILesson[];
};

export interface TCreateCourseParams extends Omit<Icourse, "lectures"> {
  lectures: TUpdateLessonParams[];
}

export type TCreateCourse = {
  title: string;
  slug: string; // tạo slug từ title
};

export type TUpdateCourse = {
  slug: string;
  updateData: Partial<Icourse>; // Partial giúp chúng ta có thể hoặc không cập nhật cũng không xảy xa lỗi (giống optional), truyền Icourse để lấy cấu trúc của nó,
  path?: string;
};

export type TCreateLectureParams = {
  course: string;
  order?: number;
  title?: string;
  path?: string;
};

export type TUpdateLectureParams = {
  lectureId: string;
  updateData: {
    title?: string;
    order?: number;
    path?: string;
    _destroy?: boolean;
  };
};

export type TEditLessonParams = {
  course: string;
  lessonId: string;
  updateData: {
    title?: string;
    slug?: string;
    order?: number;
    duration?: number;
    _destroy?: boolean;
    video_url?: string;
    content?: string;
  };
  path?: string;
};

export type IcourseUpdateParams = {
  _id: string;
  title: string;
  slug: string;
  lectures: ILecture[];
};

export type TCreateLessonParams = {
  lecture: string;
  course: string;
  title?: string;
  order?: number;
  path: string;
  slug?: string;
  duration?: number;
};

export type TCreateHistoryParams = {
  course: string;
  lesson: string;
  checked: boolean | string;
};

// export enum EcourseStatus {
//   PENDING = "PENDING",
//   APPROVED = "APPROVED",
//   REJECTED = "REJECTED",
// }

export type EGetAllCourseParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: EcourseStatus;
};

export type EGetAllCouponParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ECouponStatus;
  course?: string;
  coupon_type?: ECouponType;
}

export type EGetAllOrderParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: EOrderStatus;
};

export type TCreateOrderParams = {
  code?: string;
  course?: string;
  user?: string;
  total?: number;
  amount?: number;
  discount?: number;
  coupon?: string;
};

export type TUpdateOrderParams = {
  code: string;
  updateData: Partial<Iorder>; 
}


export type TCreateCouponParams = {
  code : string,
  title? : string,
  value? : number,
  status? : ECouponStatus,
  start_date? : Date,
  end_date? : Date,
  number? : number,
  course? : string[],
  coupon_type? : ECouponType,
}


export type TUpdateCouponParams = {
  code : string,
  updateData : {
    title? : string,
    value? : number,
    status? : ECouponStatus,
    start_date? : Date,
    end_date? : Date,
    number? : number,
    course? : string[],
    coupon_type? : ECouponType,
  }
}


export type TUpdateCourseToCouponParams = {
  code : string,
  course : Icourse,
}

export type TAddCommentToCourseParams = {
  courseId : string,
  question? : string,
  answer? : string,
}