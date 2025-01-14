import { EcourseLevel, EcourseStatus, EOrderStatus } from "@/contants/enums";
import { model, models, Schema } from "mongoose";

export interface Iorder extends Document {
  _id :  string,
  amount: number,
  discount: number,
  total: number,
  create_at: Date,
  course: Schema.Types.ObjectId,
  code : string,
  user : Schema.Types.ObjectId
  status : EOrderStatus
  coupon : Schema.Types.ObjectId
}
const orderSchema = new Schema<Iorder>({
  amount: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  code: {
    type: String,
    required: true, // bắt buộc có
    unique: true, //  không được trùng 
  },
  status: {
    type: String,
    enum: Object.values(EOrderStatus),
    default: EOrderStatus.PENDING,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "course",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "coupon",
  },
});

const Order = models.Order || model<Iorder>("Order", orderSchema);

export default Order;
