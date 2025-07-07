import Project from "../../models/project.js";
import Task from "../../models/task.js";

export const dashboardData = async (req, res) => {
  const userId = req.user.id;

  const projects = await Project.find({ projectManager: userId }).select("_id");

  const projectIds = projects.map((project) => project._id);

  const totalTask = await Task.find({ isActive: true }).countDocuments();
  const todoTask = await Task.find({
    isActive: true,
    state: "Todo",
    projectId: { $in: projectIds },
  }).countDocuments();
  const inProgressTask = await Task.find({
    isActive: true,
    state: "In Progress",
    projectId: { $in: projectIds },
  }).countDocuments();
  const completedTask = await Task.find({
    isActive: true,
    state: "Completed",
    projectId: { $in: projectIds },
  }).countDocuments();
  const overDueTask = await Task.find({
    isActive: true,
    state: { $ne: "Completed" },
    dueDate: { $lt: new Date() },
    projectId: { $in: projectIds },
  }).countDocuments();
  const totalProjects = await Project.find({
    isActive: true,
    projectManager: userId,
  }).countDocuments();
  res.status(200).json({
    success: true,
    data: {
      totalTask,
      todoTask,
      inProgressTask,
      completedTask,
      overDueTask,
      totalProjects,
    },
  });
};

export const getAllProjectsWithProgress = async (req, res) => {
  const userId = req.user.id;
  // Find all projects and populate necessary fields
  const projects = await Project.find({ projectManager: userId })
    .select("name teamMembers projectManager")
    .populate("projectManager", "name email")
    .populate("teamMembers", "name email")
    .exec();

  // If no projects are found, return an empty array
  if (!projects || projects.length === 0) {
    return [];
  }

  // Iterate through each project to calculate progress
  const projectsWithProgress = await Promise.all(
    projects.map(async (project) => {
      const totalTasks = await Task.countDocuments({
        projectId: project._id,
        isActive: true,
      });
      const completedTasks = await Task.countDocuments({
        projectId: project._id,
        state: "Completed",
        isActive: true,
      });

      // Calculate progress as a percentage
      const progress =
        totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

      // Format the project data
      return {
        name: project.name,
        manager: {
          name: project.projectManager.name,
          email: project.projectManager.email,
        },
        members: project.teamMembers.map((member) => ({
          name: member.name,
          email: member.email,
        })),
        progress: Math.round(progress),
      };
    })
  );

  res.json({ success: true, tableData: projectsWithProgress });
};
