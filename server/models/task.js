import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    state: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
      default: "Low",
    },
    dueDate: {
      type: Date,
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attachments: [
      {
        fileName: {
          type: String,
        },
        originalName: {
          type: String,
        },
      },
    ],
    dependencies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],    
    comments: [
      {
        commenterId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        commenterName: {
          type: String,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        mentionedUsers: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    order: {
      type: Number,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
