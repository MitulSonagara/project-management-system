import Column from "../../models/column.js";
import Task from "../../models/task.js";

const getColumns = async (req, res) => {
  const { filters, userId } = req.query;
  try {
    const columns = await Column.find({
      projectId: filters.selectedProject,
      isActive: true,
    }).sort({ order: 1 });

    const columnsWithTasks = await Promise.all(
      columns.map(async (column) => {

        let taskQuery = {
          columnId: column._id,
          isActive: true,
          assignees: { $in: [userId] }
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
    console.error("Error fetching columns", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch columns" });
  }
};

export { getColumns };
