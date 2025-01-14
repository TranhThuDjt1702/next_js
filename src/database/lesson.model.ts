import { ELessonType } from "@/contants/enums";
import { Document, model, models, Schema } from "mongoose";


export interface ILesson extends Document{
    _id: string,
    title: string,
    slug: string,
    _destroy : boolean,
    lecture: Schema.Types.ObjectId,
    create_at: Date,
    course: Schema.Types.ObjectId,
    type: ELessonType,
    order:number,
    duration:number,
    video_url: string,
    content: string,
}

const lessonSchema = new Schema<ILesson>({
    title:{
        type:String,
        required: true
    },
    slug:{
        type:  String,
        required: true,
    },
    order:{
        type:Number,
        default:0
    },
    content:{
        type:String,
    },
    video_url:{
        type:String,
    },
    _destroy:{
        type:Boolean,
        default: false
    },
    create_at:{
        type:Date,
        default:Date.now
    },
    lecture:{
        type:Schema.Types.ObjectId,
       
    },
    course:{
        type:Schema.Types.ObjectId,
        
    },
    type:{
        type:String,
        enum: Object.values(ELessonType),
        default: ELessonType.VIDEO
    },
    duration:{
        type:Number,
        default:0
    },
})
const Lesson = models.Lesson || model<ILesson>("Lesson", lessonSchema)

export default Lesson