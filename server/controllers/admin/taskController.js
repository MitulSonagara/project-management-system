import Notification from "../../models/notifications.js";
import Task from "../../models/task.js";
import User from "../../models/user.js";
import Column from "../../models/column.js";
import ActivityLog from "../../models/activityLog.js";
import mongoose from "mongoose";

const createTask = async (req, res) => {
  const {
    name,
    description,
    createdBy,
    priority,
    dueDate,
    columnId,
    state,
    assignees,
    projectId,
    dependencies,
  } = req.body;

  const attachments = [];
  req.files.forEach((file) =>
    attachments.push({
      fileName: file.filename,
      originalName: file.originalname,
    })
  );

  try {
    const taskCount = await Task.countDocuments({ columnId });
    const task = await Task.create({
      name,
      createdBy,
      description,
      columnId,
      priority,
      dueDate,
      state,
      assignees,
      projectId,
      order: taskCount,
      attachments,
      dependencies,
    });

    await ActivityLog.create({
      projectId: projectId,
      userId: req.user.id,
      action: "Created",
      entity: "Task",
      entityId: task._id,
      details: `New Task Created: ${task.name}`,
    });

    if (assignees && assignees.length > 0) {
      await User.updateMany(
        { _id: { $in: assignees } },
        { $push: { tasks: task._id } }
      );
    }

    await Promise.all(
      assignees.map(async (ele) => {
        await Notification.create({
          userId: ele.toString(),
          title: "New task created",
          message: `${task.name} has been assigned to you.`,
        });
      })
    );

    req.io.emit("taskNotification", {
      members: [...assignees.map((ele) => ele.toString())],
      message: `${task.name} has been assigned to you.`,
    });

    return res
      .status(201)
      .json({ success: true, message: "Task Created Successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create task" });
  }
};

const editTask = async (req, res) => {
  const { taskId, name, description, priority, dueDate, assignees } = req.body;
  try {
    const task = await Task.findById(taskId);
    task.name = name;
    task.description = description;
    task.priority = priority;
    if (dueDate) {
      task.dueDate = dueDate;
    }
    if (assignees) {
      task.assignees = assignees;
    }
    task.save();
    res
      .status(200)
      .json({ success: true, message: "Task updated successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update task" });
  }
};

const updateTaskPosition = async (req, res) => {
  const { taskId } = req.params;
  const { columnId, order } = req.body;

  try {
    const oldTask = await Task.findById(taskId)
      .select("columnId")
      .populate("columnId", "name");
    const column = await Column.findById(columnId).select("name");
    const task = await Task.findById(taskId).populate("dependencies");

    if (column.name === "Completed") {
      // Ensure all dependencies are completed
      const incompleteDependencies = task.dependencies.filter(
        (dep) => dep.state !== "Completed"
      );

      if (incompleteDependencies.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Task cannot be completed until all dependencies are completed.",
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { columnId, order, state: column.name },
      { new: true }
    );

    await ActivityLog.create({
      projectId: updatedTask.projectId,
      userId: req.user.id,
      action: "Moved",
      entity: "Task",
      entityId: updatedTask._id,
      details: `${updatedTask.name} moved from ${oldTask.columnId.name} to ${column.name}`,
    });

    res.status(200).json({ success: true, updatedTask });
  } catch (error) {
    console.error("Error updating task position:", error);
    return res.status(500).json({ message: "Failed to update task position" });
  }
};

const addComment = async (req, res) => {
  const { taskId } = req.params;
  const { commenterId, content, mentionedUsers, commenterName } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newComment = {
      commenterId,
      commenterName,
      content,
      mentionedUsers: mentionedUsers || [],
    };

    task.comments.push(newComment);
    await task.save();

    res
      .status(200)
      .json({ success: true, message: "Comment added successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findByIdAndUpdate(taskId, { isActive: false });

    await ActivityLog.create({
      projectId: task.projectId,
      userId: req.user.id,
      action: "Deleted",
      entity: "Task",
      entityId: task._id,
      details: `Deleted Task: ${task.name}`,
    });

    res
      .status(200)
      .json({ success: true, message: "Task Deleted Succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({
      projectId: projectId,
      isActive: true,
    }).select("name");

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  createTask,
  updateTaskPosition,
  addComment,
  deleteTask,
  editTask,
  getAllTasks,
};
