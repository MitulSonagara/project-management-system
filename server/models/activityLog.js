import mongoose, { Schema } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["Created", "Updated", "Deleted", "Moved"],
      required: true,
    },
    entity: {
      type: String,
      enum: ["Task", "Column","Project"],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);
export default ActivityLog;
