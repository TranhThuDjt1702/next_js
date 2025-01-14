import { ECouponStatus, ECouponType, EcourseStatus } from "@/contants/enums";
import { model, models, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  title: string;
  value: number;
  status: ECouponStatus;
  coupon_type: ECouponType;
  number : number;
  start_date: Date;
  end_date: Date;
  create_at: Date;
  course: Schema.Types.ObjectId[] ;
}

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  value: {
    type: Number,
  },
  status: {
    type: String,
    enum: ECouponStatus,
    default: ECouponStatus.INACTIVE,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  course:[{
    type: Schema.Types.ObjectId ,
    ref: "Course",
  }],
  coupon_type: {
    type: String,
    enum: ECouponType,
  },
  number: {
    type: Number,
  },
});
const Coupon = models.Coupon || model<ICoupon>("Coupon", couponSchema);

export default Coupon;
