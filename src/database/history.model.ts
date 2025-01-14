import { EcourseLevel, EcourseStatus } from "@/contants/enums";
import { model, models, Schema } from "mongoose";
import { boolean } from "zod";

export interface IHistory extends Document {
    _id: string;
    lesson: Schema.Types.ObjectId;
    course: Schema.Types.ObjectId;
    create_at: Date;
    checked: boolean | string;
}
const HistorySchema = new Schema<IHistory>({
    lesson: {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    create_at: {
        type: Date,
        default: Date.now,
    },
    checked: {
        type: Boolean,
        default: false,
    }
});

const History = models.History || model<IHistory>("History", HistorySchema);

export default History;
