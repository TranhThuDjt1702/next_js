import { EuserRoles, EuserStatus } from "@/contants/enums";
import { Document, model, models } from "mongoose";
import { Schema } from "mongoose";
export interface IUser extends Document{
    clerkId :  string;
    name : string;
    userName : string;
    email_address :  string;
    avatar :  string;
    courses :  Schema.Types.ObjectId[]; // khóa ngoại để liên kết giữa các bảng
    createAt : Date;
    role : EuserRoles;
    status : EuserStatus;
}

const userSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    userName: {
        type: String,
        unique:true,
        required: true
    },
    email_address:{
        type : String,
        unique: true,
        required : true
    },
    avatar : {
        type: String
    },
    courses:{
        type: [Schema.Types.ObjectId],
        ref: 'Course'
    },
    createAt:{
        type: Date,
        default: Date.now
    },
    role:{
        type: String,
        enum : Object.values(EuserRoles),
        default: EuserRoles.USER
    },
    status:{
        type: String,
        enum : Object.values(EuserStatus),
        default: EuserStatus.ACTIVE
    }
})

const User = models.User || model<IUser>("User", userSchema)

export default User