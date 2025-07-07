import Column from "../../models/column.js";
import Task from "../../models/task.js";
import ActivityLog from "../../models/activityLog.js";

const createColumn = async (req, res) => {
  const { name, projectId } = req.body;
  if (!name || !projectId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const columnCount = await Column.countDocuments({ projectId });
    const column = await Column.create({
      name,
      projectId,
      order: columnCount,
    });

    await ActivityLog.create({
      projectId: projectId,
      userId: req.user.id,
      action: "Created",
      entity: "Column",
      entityId: column._id,
      details: `New Column Created: ${column.name}`,
    });

    return res
      .status(201)
      .json({ success: true, message: "Column created successfully" });
  } catch (error) {
    console.error("Error creating column:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create column" });
  }
};

const getColumns = async (req, res) => {
  const { filters } = req.query;
  try {
    // Fetch all active columns for the given project
    const columns = await Column.find({
      projectId: filters.selectedProject,
      isActive: true,
    }).sort({
      order: 1,
    });

    // Fetch tasks for each column and attach them
    const columnsWithTasks = await Promise.all(
      columns.map(async (column) => {
        let taskQuery = {
          columnId: column._id,
          isActive: true,
        };

        if (filters.priority) {
          taskQuery.priority = filters.priority;
        }

        if (filters.search) {
          const searchRegex = new RegExp(filters.search, "i");
          taskQuery.$or = [
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
          ];
        }

        if (filters.dueDate) {
          taskQuery.dueDate = new Date(filters.dueDate);
        }

        const tasks = await Task.find(taskQuery)
          .sort({ order: 1 })
          .populate("assignees", "name email")
          .populate("createdBy", "name email")
          .populate("dependencies","state name");
        return { ...column.toObject(), tasks };
      })
    );

    res.status(200).json({ success: true, columnsWithTasks });
  } catch (error) {
    console.error("Error fetching columns:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch columns" });
  }
};

export { createColumn, getColumns };
