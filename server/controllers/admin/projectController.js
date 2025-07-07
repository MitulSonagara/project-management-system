import User from "../../models/user.js";
import Project from "../../models/project.js";
import Notification from "../../models/notifications.js";
import Column from "../../models/column.js";
import Task from "../../models/task.js";
import ActivityLog from "../../models/activityLog.js";

const createProject = async (req, res) => {
  const { name, description, projectManager, teamMembers } = req.body;

  // Validate required fields
  if (!name || !projectManager) {
    return res.status(400).json({
      success: false,
      message: "Name and Project Manager are required.",
    });
  }

  try {
    const createdBy = req.user.id;

    const project = await Project.create({
      name,
      description,
      createdBy,
      projectManager,
      teamMembers,
    });

    await ActivityLog.create({
      projectId: project._id,
      userId: req.user.id,
      action: "Created",
      entity: "Project",
      entityId: project._id,
      details: `New Project Created: ${project.name}`,
    });

    const user = await User.findById(projectManager);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Project Manager not found." });
    }

    user.role = "manager";
    user.assignedProjects.push(project._id); // Add the board ID to the user's assigned projects
    await user.save();

    // Create the default columns: todo, in progress, completed
    const columns = ["Todo", "In Progress", "Completed"];
    const columnPromises = columns.map(async (columnName, index) => {
      await Column.create({
        name: columnName,
        projectId: project._id,
        order: index, // Ensure order is correct: 0 for Todo, 1 for In Progress, etc.
      });
    });

    // Wait for all columns to be created
    await Promise.all(columnPromises);

    await Promise.all(
      teamMembers.map(async (member) => {
        await Notification.create({
          userId: member.toString(),
          title: "New Project Created",
          message: `You have been added to ${project.name} team.`,
        });
      })
    );

    await Notification.create({
      userId: projectManager.toString(),
      title: "New Project Created",
      message: `${project.name} has been assigned to you.`,
    });

    req.io.emit("projectNotification", {
      members: [...teamMembers.map((member) => member.toString())],
      message: `You have been added to ${project.name} team.`,
    });

    req.io.emit("projectNotification", {
      members: [projectManager.toString()],
      message: `${project.title} has been assigned to you.`,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create project. Please try again later.",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .populate({ path: "createdBy", select: "name email" })
      .populate({ path: "projectManager", select: "name email" })
      .sort({ createdAt: -1 });

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        // Count the total tasks for the project
        const totalTasks = await Task.countDocuments({
          projectId: project._id,
          isActive: true,
        });

        // Count the completed tasks for the project
        const completedTasks = await Task.countDocuments({
          projectId: project._id,
          state: "Completed",
          isActive: true,
        });

        // Calculate progress as a percentage
        const progress =
          totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        const roundedProgress = progress.toFixed(0);
        // Add the progress to the project object
        return { ...project.toObject(), progress: roundedProgress };
      })
    );

    res.json({ success: true, projects: projectsWithProgress });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { createProject, getAllProjects };
