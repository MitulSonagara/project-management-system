import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status:{
        type:Number, //0 - Deleted, 1 - Unread, 2 - Read
        default:1,
    }
}, { timestamps: true });


const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;