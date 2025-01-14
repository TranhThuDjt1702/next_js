import { EcourseLevel, EcourseStatus } from "@/contants/enums";
import { model, models, Schema } from "mongoose";

export interface Icourse extends Document {
  _id: string;
  title: string;
  image: string;
  intro_url: string;
  desc: string;
  price: number;
  sale_price: number;
  author: Schema.Types.ObjectId;
  slug: string;
  status: EcourseStatus;
  create_at: String;
  level: EcourseLevel;
  views: number;
  rating: number[];

  info: {
    requiment: string[];
    benefits: string[];
    qa: {
      question: string;
      answer: string;
    }[];
  };
  lectures: Schema.Types.ObjectId[];
  _destroy: boolean;
}
const courseSchema = new Schema<Icourse>({
  title: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default: "",
  },
  intro_url: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  sale_price: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: Object.values(EcourseStatus),
    default: EcourseStatus.PENDING,
  },
  level : {
    type:  String,
    enum : Object.values(EcourseLevel),
    default: EcourseLevel.BEGINNER
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lectures: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  rating: {
    type: [Number],
    default: [5],
  },
  views: {
    type: Number,
    default: 0,
  },
  info: {
    requiment: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    qa: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
});

const Course = models.Course || model<Icourse>("Course", courseSchema);

export default Course;
