import ActivityLog from "../../models/activityLog.js";
import Column from "../../models/column.js";
import Task from "../../models/task.js";
import User from "../../models/user.js";

const deleteTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    const task = await Task.findById(taskId);
    if (task.createdBy == userId) {
      task.isActive = false;
      await task.save();

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
    } else {
      return res.status(200).json({
        success: false,
        message: "Cannot delete task created by others",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createTask = async (req, res) => {
  const {
    name,
    description,
    createdBy,
    priority,
    dueDate,
    columnId,
    state,
    dependencies,
    projectId,
  } = req.body;
  const assignees = [];
  assignees.push(createdBy);

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
      dependencies,
      attachments,
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
      .json({ success: true, message: "Comment added successfully" });
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

export { createTask, deleteTask, addComment, updateTaskPosition, getAllTasks };
