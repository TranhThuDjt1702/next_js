import { model, models, Schema, Document } from "mongoose";
export interface ILecture extends Document {
  _id: string;
  title: string;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId[];
  create_at: Date;
  _destroy: boolean;
}

const LectureSchema = new Schema<ILecture>({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  lesson: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  create_at: {
    type: Date,
    default: Date.now,
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
});

const Lecture = models.Lecture || model<ILecture>("Lecture", LectureSchema);
export default Lecture;
